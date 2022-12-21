const express = require("express");
const router = express.Router();
const Referent = require("../models/referents");

// Fetch all Referents
router.get("/", async (req, res, next) => {
  try {
    const allReferents = await Referent.find();
    res.json({
      result: true,
      severity: "success",
      message: "All referents have been retieved !",
      data: allReferents
    });
  } catch (err) {
    const message = "An error has occured, please retry later.";
    res.json({ result: false, message, severity: "error", data: err });
    throw err;
  }
});

module.exports = router;
