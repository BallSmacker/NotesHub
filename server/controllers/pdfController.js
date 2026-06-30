const supabase = require("../config/supabase");
const crypto = require("crypto");
const pool = require("../database/db");

// Upload PDF
const uploadPdf = async (req, res) => {
  try {
    const { subject_id, type, module } = req.body;

    if (!subject_id) {
      return res.status(400).json({
        message: "Subject is required",
      });
    }

    if (!["Notes", "Practical"].includes(type)) {
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
      return res.status(400).json({
        message: "Please upload a PDF",
      });
    }
    const subject = await pool.query("SELECT id FROM subjects WHERE id = $1", [
      subject_id,
    ]);

    if (subject.rows.length === 0) {
      return res.status(404).json({
        message: "Subject not found",
      });
    }
    const existing = await pool.query(
      `SELECT id
   FROM pdfs
   WHERE subject_id = $1
   AND type = $2
   AND module = $3`,
      [subject_id, type, module],
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({
        message:
          "A PDF already exists for this subject, type and module. Use Replace instead.",
      });
    }
    const uniqueName =
      crypto.randomUUID() + "-" + req.file.originalname.replace(/\s+/g, "_");

    const { error } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .upload(uniqueName, req.file.buffer, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
    const { data } = supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .getPublicUrl(uniqueName);

    const filename = req.file.originalname;
    const file_url = data.publicUrl;

    const result = await pool.query(
      `INSERT INTO pdfs
      (subject_id, type, module, filename, file_url, storage_filename)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [subject_id, type, module, filename, file_url, uniqueName],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Get all PDFs
const getAllPdfs = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        pdfs.*,
        subjects.subject_name
      FROM pdfs
      JOIN subjects
      ON pdfs.subject_id = subjects.id
      ORDER BY subjects.display_order, pdfs.module
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Get PDFs by Subject
const getPdfsBySubject = async (req, res) => {
  try {
    const { subjectId } = req.params;

    const result = await pool.query(
      `SELECT
        pdfs.*,
        subjects.subject_name
      FROM pdfs
      JOIN subjects
      ON pdfs.subject_id = subjects.id
      WHERE pdfs.subject_id = $1
      ORDER BY pdfs.type, pdfs.module`,
      [subjectId],
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const deletePdf = async (req, res) => {
  try {
    const { id } = req.params;

    const pdf = await pool.query("SELECT * FROM pdfs WHERE id = $1", [id]);

    if (pdf.rows.length === 0) {
      return res.status(404).json({
        message: "PDF not found",
      });
    }

    const { error } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .remove([pdf.rows[0].storage_filename]);

    if (error) {
      return res.status(500).json({
        message: error.message,
      });
    }

    await pool.query("DELETE FROM pdfs WHERE id = $1", [id]);

    res.json({
      message: "PDF deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const replacePdf = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a PDF",
      });
    }

    // Find existing PDF
    const pdf = await pool.query("SELECT * FROM pdfs WHERE id = $1", [id]);

    if (pdf.rows.length === 0) {
      return res.status(404).json({
        message: "PDF not found",
      });
    }

    // Delete old file from Supabase
    const { error: deleteError } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .remove([pdf.rows[0].storage_filename]);

    if (deleteError) {
      return res.status(500).json({
        message: deleteError.message,
      });
    }

    // Generate unique filename
    const uniqueName =
      crypto.randomUUID() + "-" + req.file.originalname.replace(/\s+/g, "_");

    // Upload new file
    const { error: uploadError } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .upload(uniqueName, req.file.buffer, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (uploadError) {
      return res.status(500).json({
        message: uploadError.message,
      });
    }

    // Get public URL
    const { data } = supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .getPublicUrl(uniqueName);

    const filename = req.file.originalname;
    const file_url = data.publicUrl;

    // Update database
    const result = await pool.query(
      `UPDATE pdfs
       SET filename = $1,
           file_url = $2,
           storage_filename = $3,
           uploaded_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING *`,
      [filename, file_url, uniqueName, id],
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  uploadPdf,
  getAllPdfs,
  getPdfsBySubject,
  deletePdf,
  replacePdf,
};
