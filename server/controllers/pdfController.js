const pool = require("../database/db");
const fs = require("fs");
const path = require("path");

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
        message: "Type must be either Notes or Practicals",
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
      return res.status(400).json({
        message: "Subject not found",
      });
    }
    const filename = req.file.originalname;
    const file_url = `/uploads/${req.file.filename}`;

    const result = await pool.query(
      `INSERT INTO pdfs
      (subject_id, type, module, filename, file_url)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [subject_id, type, module, filename, file_url],
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

// Delete PDF
const deletePdf = async (req, res) => {
  try {
    const { id } = req.params;

    // Find PDF in database
    const pdf = await pool.query("SELECT * FROM pdfs WHERE id = $1", [id]);

    if (pdf.rows.length === 0) {
      return res.status(404).json({
        message: "PDF not found",
      });
    }

    const filePath = path.join(
      __dirname,
      "..",
      "uploads",
      path.basename(pdf.rows[0].file_url),
    );

    // Delete file
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (err) {
      console.error("❌ Error deleting file:", err);
    }

    // Delete database record
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

    const pdf = await pool.query("SELECT * FROM pdfs WHERE id = $1", [id]);

    if (pdf.rows.length === 0) {
      return res.status(404).json({
        message: "PDF not found",
      });
    }

    const oldFilePath = path.join(
      __dirname,
      "..",
      "uploads",
      path.basename(pdf.rows[0].file_url),
    );

    if (fs.existsSync(oldFilePath)) {
      fs.unlinkSync(oldFilePath);
    }

    const filename = req.file.originalname;
    const file_url = `/uploads/${req.file.filename}`;

    const result = await pool.query(
      `UPDATE pdfs
      SET filename = $1, file_url = $2, uploaded_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *`,
      [filename, file_url, id],
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
