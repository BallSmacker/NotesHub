const pool = require("../database/db");

const getSubjects = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM subjects ORDER BY display_order ASC",
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "Server Error" });
  }
};

const addSubject = async (req, res) => {
  try {
    const { subject_name, display_order } = req.body;

    if (!subject_name || subject_name.trim() === "") {
      return res.status(400).json({
        message: "Subject name is required",
      });
    }

    if (!Number.isInteger(display_order) || display_order < 1) {
      return res.status(400).json({
        message: "Display order must be a positive number",
      });
    }

    const result = await pool.query(
      `INSERT INTO subjects (subject_name, display_order)
      VALUES ($1, $2)
      RETURNING *`,
      [subject_name, display_order],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM subjects WHERE id = $1 RETURNING *",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Subject not found",
      });
    }

    res.json({
      message: "Subject deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const getSubjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query("SELECT * FROM subjects WHERE id = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Subject not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { subject_name, display_order } = req.body;

    const result = await pool.query(
      "UPDATE subjects SET subject_name = $1,display_order = $2 WHERE id = $3 RETURNING *",
      [subject_name, display_order, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Subject not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  getSubjects,
  addSubject,
  deleteSubject,
  getSubjectById,
  updateSubject,
};
