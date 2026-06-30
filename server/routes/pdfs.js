const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload");

const {
  uploadPdf,
  getAllPdfs,
  getPdfsBySubject,
  deletePdf,
  replacePdf,
} = require("../controllers/pdfController");

router.post("/", upload.single("pdf"), uploadPdf);
router.get("/", getAllPdfs);
router.get("/subject/:subjectId", getPdfsBySubject);
router.put("/:id", upload.single("pdf"), replacePdf);
router.delete(
  "/:id",
  (req, res, next) => {
    console.log("DELETE route hit");
    next();
  },
  deletePdf,
);
module.exports = router;
