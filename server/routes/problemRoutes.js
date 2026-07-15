const express = require("express");
const router = express.Router();
const { createProblem, getAllProblems, updateProblem, deleteProblem, syncLeetCode } = require("../controllers/problemController");

router.post("/",      createProblem);
router.get("/",       getAllProblems);
router.post("/sync-leetcode", syncLeetCode);
router.patch("/:id",  updateProblem);
router.delete("/:id", deleteProblem);

module.exports = router;
