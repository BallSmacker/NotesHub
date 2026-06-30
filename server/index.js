require("dotenv").config();
const path = require("path");
const pool = require("./database/db");
const express = require("express");
const subjectRoutes = require("./routes/subjects");
const pdfRoutes = require("./routes/pdfs");
const app = express();
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/subjects", subjectRoutes);
app.use("/pdfs", pdfRoutes);
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Welcome to NotesHub Backend!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
