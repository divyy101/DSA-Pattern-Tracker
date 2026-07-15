const Problem = require("../models/Problem");

const createProblem = async (req, res) => {
  try {
    const { problemName, pattern, difficulty, status, notes } = req.body;
    const newProblem = await Problem.create({ problemName, pattern, difficulty, status, notes });
    res.status(201).json(newProblem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.find().sort({ createdAt: -1 });
    res.status(200).json(problems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProblem = await Problem.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedProblem) return res.status(404).json({ message: "Problem not found" });
    res.status(200).json(updatedProblem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Problem.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Problem not found" });
    res.status(200).json({ message: "Problem deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const syncLeetCode = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).json({ message: "Username is required" });

    const query = `
      query recentAcSubmissions($username: String!, $limit: Int!) {
        recentAcSubmissionList(username: $username, limit: $limit) {
          title
        }
      }
    `;

    const leetcodeRes = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0"
      },
      body: JSON.stringify({
        query,
        variables: { username, limit: 50 }
      })
    });

    const data = await leetcodeRes.json();
    const submissions = data?.data?.recentAcSubmissionList;
    
    if (!submissions) {
      return res.status(400).json({ message: "Invalid username or LeetCode API error" });
    }

    const solvedTitles = submissions.map(sub => sub.title.toLowerCase());
    
    const unsolvedProblems = await Problem.find({ status: "Unsolved" });
    let updatedCount = 0;
    
    for (let problem of unsolvedProblems) {
      if (solvedTitles.includes(problem.problemName.toLowerCase())) {
        problem.status = "Solved";
        await problem.save();
        updatedCount++;
      }
    }

    res.status(200).json({ message: `Successfully synced! Updated ${updatedCount} problems.`, updatedCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createProblem, getAllProblems, updateProblem, deleteProblem, syncLeetCode };
