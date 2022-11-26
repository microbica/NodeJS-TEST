const express = require("express");
const router = express.Router();
const { createBranch } = require("../controllers/branchController");

/* POST new branch. */
router.post("/", async (req, res, next) => {
  const {
    body: { branchName, opening, closing, days },
  } = req;

  try {
    const { status, message } = await createBranch(
      branchName,
      opening,
      closing,
      days
    );
    res.status(status).json(message);
  } catch (err) {
    res.status(404).json("A error was encountered");
  }
});

module.exports = router;
