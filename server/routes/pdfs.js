const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const authenticateToken = require("../middleware/auth");

const {
  uploadPdf,
  getAllPdfs,
  getPdfsBySubject,
  deletePdf,
  replacePdf,
} = require("../controllers/pdfController");

// Public routes
router.get("/", getAllPdfs);
router.get("/subject/:subjectId", getPdfsBySubject);

// Protected routes
router.use(authenticateToken);

router.post("/", upload.single("pdf"), uploadPdf);
router.put("/:id", upload.single("pdf"), replacePdf);
router.delete("/:id", deletePdf);

module.exports = router;
