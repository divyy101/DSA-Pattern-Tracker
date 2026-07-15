const express = require("express");
const router = express.Router();
const { createProblem, getAllProblems, updateProblem, deleteProblem } = require("../controllers/problemController");

router.post("/",      createProblem);
router.get("/",       getAllProblems);
router.patch("/:id",  updateProblem);
router.delete("/:id", deleteProblem);

module.exports = router;
