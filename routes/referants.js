const express = require("express");
const router = express.Router();
const Referant = require("../models/referants");

// Fetch all Referants
router.get("/", async (req, res, next) => {
  try {
    const allReferants = await Referant.find();
    res.json({
      result: true,
      severity: "success",
      message: "All referants have been retieved !",
      data: allReferants
    });
  } catch (err) {
    const message = "An error has occured, please retry later.";
    res.json({ result: false, message, severity: "error", data: err });
    throw err;
  }
});

module.exports = router;
