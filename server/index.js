require("dotenv").config();
const cors = require("cors");
const authRoutes = require("./routes/auth");
const path = require("path");
const express = require("express");
const subjectRoutes = require("./routes/subjects");
const pdfRoutes = require("./routes/pdfs");
const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://noteshubfrontend.vercel.app",
  "https://noteshubfrontend-kdb3lqdb0-ballsmackers-projects.vercel.app",
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      callback(new Error("Not allowed by CORS"));
    },
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
