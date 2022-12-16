const express = require("express");
const router = express.Router();
const Structure = require("../models/structures");
const { checkBody } = require("../modules/checkBody");
const auth = require("../auth/auth");

// Get all structures
router.get("/", auth, async (req, res, next) => {
  try {
    const allStructures = await Structure.find();
    res.json({
      result: true,
      data: allStructures,
      severity: "success",
      message: "All structures have been retrieved !"
    });
  } catch (err) {
    const message = "An error has occured, please retry later.";
    res.json({ result: false, message, severity: "error", data: err });
    throw err;
  }
});

// Get one structure information
router.get("/:structureId", auth, async (req, res) => {
  try {
    const structure = await Structure.findById(req.params.structureId);
    res.json({
      result: true,
      data: structure,
      severity: "success",
      message: "Structure have been retrieved !"
    });
  } catch (err) {
    const message = "An error has occured, please retry later.";
    res.json({ result: false, message, severity: "error", data: err });
    throw err;
  }
});

// delete an Structure
router.delete("/:structureId", auth, async (req, res) => {
  try {
    const structure = await Structure.findOneAndDelete({
      _id: req.params.structureId
    });
    res.json({
      result: true,
      severity: "success",
      message: "Structure has been deleted successfully !",
      userInfo: structure
    });
  } catch (err) {
    const message = "An error has occured, please retry later.";
    res.json({ result: false, message, severity: "error", data: err });
    throw err;
  }
});

// Create new Structure
router.post("/create", auth, async (req, res) => {
  try {
    if (!checkBody(req.body, ["name"])) {
      res.json({
        result: false,
        severity: "error",
        message: "Missing or empty fields"
      });
      return;
    }
    const { name } = req.body;
    const response = await Structure.findOne({ name: name });
    if (response === null) {
      const newStructure = await new Structure(req.body);
      const structure = await newStructure.save();
      const message = "Structure added successfully !";
      res.json({ result: true, severity: "success", message, data: structure });
    } else {
      res.json({
        result: false,
        severity: "error",
        message: "Structure already exists"
      });
    }
  } catch (err) {
    const message = "An error has occured, please retry later.";
    res.json({ result: false, message, severity: "error", data: err });
    throw err;
  }
});

// Update a mission
router.post("/update", auth, async (req, res, next) => {
  try {
    if (!checkBody(req.body, ["name"])) {
      return res.json({ result: false, message: "Missing or empty fields" });
    }
    const response = await Structure.findByIdAndUpdate(
      req.body.structureId,
      req.body
    );
    const message = "Structure updated successfully !";
    res.json({ result: true, severity: "success", message, data: response });
  } catch (err) {
    const message = "An error has occured, please retry later.";
    res.json({ result: false, message, severity: "error", data: err });
    throw err;
  }
});

module.exports = router;
