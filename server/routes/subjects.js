const express = require("express");

const router = express.Router();

const {
  getSubjects,
  addSubject,
} = require("../controllers/subjectsController");

router.get("/", getSubjects);
router.post("/", addSubject);

module.exports = router;
