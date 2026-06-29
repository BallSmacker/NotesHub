require("dotenv").config();
const pool = require("./database/db");
const express = require("express");
const subjectRoutes = require("./routes/subjects");
const app = express();
app.use(express.json());
app.use("/subjects", subjectRoutes);
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Welcome to NotesHub Backend!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
