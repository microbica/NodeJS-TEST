const express = require("express");
const router = express.Router();
const {
  createMechanic,
  scheduleMechanic,
} = require("../controllers/mechanicController");

/* POST new mechanic. */
router.post("/", async (req, res, next) => {
  const {
    body: { name, email, branch },
  } = req;
  try {
    const { status, message } = await createMechanic(name, email, branch);
    res.status(status).json(message);
  } catch (err) {
    res.status(404).json("A error was encountered");
  }
});

router.post("/schedule", async (req, res, next) => {
  const {
    body: { name, email, date, mechanic },
  } = req;

  try {
    const { status, message } = await scheduleMechanic(
      mechanic,
      name,
      email,
      date
    );
    res.status(status).json(message);
  } catch (err) {
    res.status(404).json("A error was encountered");
  }
});

module.exports = router;
