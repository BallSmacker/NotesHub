require("dotenv").config();
const cors = require("cors");
const authRoutes = require("./routes/auth");
const path = require("path");
const express = require("express");
const subjectRoutes = require("./routes/subjects");
const pdfRoutes = require("./routes/pdfs");
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/subjects", subjectRoutes);
app.use("/pdfs", pdfRoutes);
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Welcome to NotesHub Backend!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
