
const crypto = require("crypto");
const path = require("path");
const pool = require("../database/db");

const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const REGION = process.env.AWS_REGION || "ap-southeast-2";
const BUCKET = process.env.AWS_S3_BUCKET;

const s3 = new S3Client({
  region: REGION,
});

if (!BUCKET) {
  throw new Error("AWS_S3_BUCKET is missing from server environment variables");
}

const createStorageKey = (originalName) => {
  const safeName = path
    .basename(originalName)
    .replace(/[^a-zA-Z0-9._-]/g, "_");

  return `${crypto.randomUUID()}-${safeName}`;
};

const createSignedUrl = async (key) => {
  return getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: BUCKET,
      Key: key,
    }),
    { expiresIn: 3600 },
  );
};

const addSignedUrls = async (rows) =>
  Promise.all(
    rows.map(async (pdf) => ({
      ...pdf,
      file_url: await createSignedUrl(pdf.storage_filename),
    })),
  );

// Upload PDF
const uploadPdf = async (req, res) => {
  let storageKey;

  try {
    const { subject_id, type, module } = req.body;

    if (!subject_id) {
      return res.status(400).json({ message: "Subject is required" });
    }

    if (!["Notes", "Practical"].includes(type?.trim())) {
      return res.status(400).json({
        message: "Type must be either Notes or Practical",
      });
    }

    if (![1, 2, 3].includes(Number(module))) {
      return res.status(400).json({
        message: "Module must be 1, 2, or 3",
      });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Please upload a PDF" });
    }

    const subject = await pool.query(
      "SELECT id FROM subjects WHERE id = $1",
      [subject_id],
    );

    if (subject.rows.length === 0) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const existing = await pool.query(
      `SELECT id FROM pdfs
       WHERE subject_id = $1 AND type = $2 AND module = $3`,
      [subject_id, type, Number(module)],
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({
        message:
          "A PDF already exists for this subject, type and module. Use Replace instead.",
      });
    }

    storageKey = createStorageKey(req.file.originalname);

    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: storageKey,
        Body: req.file.buffer,
        ContentType: "application/pdf",
      }),
    );

    const filename = req.body.name?.trim()
      ? `${req.body.name.trim()}.pdf`
      : req.file.originalname;

    const result = await pool.query(
      `INSERT INTO pdfs
       (subject_id, type, module, filename, file_url, storage_filename)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        subject_id,
        type.trim(),
        Number(module),
        filename,
        `s3://${BUCKET}/${storageKey}`,
        storageKey,
      ],
    );

    const pdf = {
      ...result.rows[0],
      file_url: await createSignedUrl(storageKey),
    };

    return res.status(201).json(pdf);
  } catch (error) {
    console.error("Upload PDF error:", error);

    // Remove the uploaded object if the database operation failed.
    if (storageKey) {
      try {
        await s3.send(
          new DeleteObjectCommand({
            Bucket: BUCKET,
            Key: storageKey,
          }),
        );
      } catch (cleanupError) {
        console.error("S3 cleanup error:", cleanupError);
      }
    }

    return res.status(500).json({ message: "Server Error" });
  }
};

// Get all PDFs
const getAllPdfs = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT pdfs.*, subjects.subject_name
      FROM pdfs
      JOIN subjects ON pdfs.subject_id = subjects.id
      ORDER BY subjects.display_order, pdfs.module
    `);

    return res.json(await addSignedUrls(result.rows));
  } catch (error) {
    console.error("Get all PDFs error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Get PDFs by subject
const getPdfsBySubject = async (req, res) => {
  try {
    const { subjectId } = req.params;

    const result = await pool.query(
      `SELECT pdfs.*, subjects.subject_name
       FROM pdfs
       JOIN subjects ON pdfs.subject_id = subjects.id
       WHERE pdfs.subject_id = $1
       ORDER BY pdfs.type, pdfs.module`,
      [subjectId],
    );

    return res.json(await addSignedUrls(result.rows));
  } catch (error) {
    console.error("Get PDFs by subject error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Delete PDF
const deletePdf = async (req, res) => {
  try {
    const { id } = req.params;

    const pdf = await pool.query("SELECT * FROM pdfs WHERE id = $1", [id]);

    if (pdf.rows.length === 0) {
      return res.status(404).json({ message: "PDF not found" });
    }

    const storageKey = pdf.rows[0].storage_filename;

    await s3.send(
      new DeleteObjectCommand({
        Bucket: BUCKET,
        Key: storageKey,
      }),
    );

    await pool.query("DELETE FROM pdfs WHERE id = $1", [id]);

    return res.json({ message: "PDF deleted successfully" });
  } catch (error) {
    console.error("Delete PDF error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Replace PDF
const replacePdf = async (req, res) => {
  let newStorageKey;

  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "Please upload a PDF" });
    }

    const pdf = await pool.query("SELECT * FROM pdfs WHERE id = $1", [id]);

    if (pdf.rows.length === 0) {
      return res.status(404).json({ message: "PDF not found" });
    }

    const oldStorageKey = pdf.rows[0].storage_filename;
    newStorageKey = createStorageKey(req.file.originalname);

    // Upload the replacement before touching the existing PDF.
    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: newStorageKey,
        Body: req.file.buffer,
        ContentType: "application/pdf",
      }),
    );

    const filename = req.body.name?.trim()
      ? `${req.body.name.trim()}.pdf`
      : req.file.originalname;

    const result = await pool.query(
      `UPDATE pdfs
       SET filename = $1,
           file_url = $2,
           storage_filename = $3,
           uploaded_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING *`,
      [
        filename,
        `s3://${BUCKET}/${newStorageKey}`,
        newStorageKey,
        id,
      ],
    );

    // The database now points to the replacement, so remove the old object.
    try {
      await s3.send(
        new DeleteObjectCommand({
          Bucket: BUCKET,
          Key: oldStorageKey,
        }),
      );
    } catch (cleanupError) {
      console.error("Old PDF cleanup error:", cleanupError);
    }

    return res.json({
      ...result.rows[0],
      file_url: await createSignedUrl(newStorageKey),
    });
  } catch (error) {
    console.error("Replace PDF error:", error);

    if (newStorageKey) {
      try {
        await s3.send(
          new DeleteObjectCommand({
            Bucket: BUCKET,
            Key: newStorageKey,
          }),
        );
      } catch (cleanupError) {
        console.error("Replacement cleanup error:", cleanupError);
      }
    }

    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  uploadPdf,
  getAllPdfs,
  getPdfsBySubject,
  deletePdf,
  replacePdf,
};
