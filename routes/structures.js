const express = require("express");
const router = express.Router();
const Structure = require("../models/structures");
const { checkBody } = require("../modules/checkBody");

// Get all structures
router.get("/", async (req, res, next) => {
  const allStructures = await Structure.find();
  res.json(allStructures);
});

// Get one structure information
router.get("/:structureId", async (req, res) => {
  const structure = await Structure.findById(req.params.structureId);
  res.json(structure);
});

// delete an Structure
router.delete("/:structureId", async (req, res) => {
  const structure = await Structure.findOneAndDelete({
    _id: req.params.structureId
  });
  res.json({
    result: true,
    severity: "success",
    message: "Structure has been deleted successfully !",
    userInfo: structure
  });
});

// Create new Structure
router.post("/create", async (req, res) => {
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
    res.json({ result: false, severity: "error", message: "Structure already exists" });
  }
});

// Update a mission
router.post("/update", async (req, res, next) => {
  if (!checkBody(req.body, ["name"])) {
    return res.json({ result: false, message: "Missing or empty fields" });
  }
  const response = await Structure.findByIdAndUpdate(
    req.body.structureId,
    req.body
  );
  const message = "Structure updated successfully !";
  res.json({ result: true, severity: "success", message, data: response });
});

module.exports = router;
