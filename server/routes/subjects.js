const express = require("express");
const router = express.Router();

const authenticateToken = require("../middleware/auth");

const {
  getSubjects,
  getSubjectById,
  addSubject,
  updateSubject,
  deleteSubject,
} = require("../controllers/subjectsController");

router.get("/", getSubjects);
router.get("/:id", getSubjectById);

router.use(authenticateToken);

router.post("/", addSubject);
router.put("/:id", updateSubject);
router.delete("/:id", deleteSubject);

module.exports = router;
