const express = require("express");

const router = express.Router();

const {
  getSubjects,
  getSubjectById,
  addSubject,
  deleteSubject,
  updateSubject,
} = require("../controllers/subjectsController");

router.get("/", getSubjects);
router.get("/:id", getSubjectById);
router.post("/", addSubject);
router.put("/:id", updateSubject);
router.delete("/:id", deleteSubject);
module.exports = router;
