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

module.exports = {
  getSubjects,
  addSubject,
};
