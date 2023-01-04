const express = require("express");
const router = express.Router();
const Mission = require("../models/missions");
const User = require("../models/users");
const { checkBody } = require("../modules/checkBody");
const auth = require("../auth/auth");

// Fetch all Missions
router.get("/", async (req, res) => {
  try {
    const allMissions = await Mission.find()
      .populate("hostStructure")
      .populate("missionReferent")
      .populate("supportStructure")
      .populate("coordinationStructure")
      .populate("projectReferent")
      .populate("volunteer");
    res.json({
      result: true,
      data: allMissions,
      severity: "success",
      message: "All missions have been retrieved !"
    });
  } catch (err) {
    const message = "An error has occured, please retry later.";
    res.json({ result: false, message, severity: "error", data: err });
    throw err;
  }
});

// Fetch by Id
router.get("/:missionId", auth, async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.missionId)
      .populate("hostStructure")
      .populate("missionReferent")
      .populate("supportStructure")
      .populate("coordinationStructure")
      .populate("projectReferent")
      .populate("volunteer");
    res.json({
      result: true,
      data: mission,
      severity: "success",
      message: "Mission have been retrieved !"
    });
  } catch (err) {
    const message = "An error has occured, please retry later.";
    res.json({ result: false, message, severity: "error", data: err });
    throw err;
  }
});

// fetch mission by user
router.get("/:missionId/:userId", auth, async (req, res) => {
  try {
    const mission = await Mission.findOne({ volunteer: req.params.userId })
      .populate("hostStructure")
      .populate("missionReferent")
      .populate("supportStructure")
      .populate("coordinationStructure")
      .populate("projectReferent")
      .populate("volunteer");
    res.json({
      result: true,
      data: mission,
      severity: "success",
      message: "All users have been retrieved !"
    });
  } catch (err) {
    const message = "An error has occured, please retry later.";
    res.json({ result: false, message, severity: "error", data: err });
    throw err;
  }
});

// Delete By Id
router.delete("/:missionId/:userId", auth, async (req, res) => {
  try {
    const mission = await Mission.findOneAndDelete({
      _id: req.params.missionId
    });
    await User.findByIdAndUpdate(req.params.userId, {
      mission: "639494b656430998cd5eabb1"
    });
    res.json({
      result: true,
      severity: "success",
      message: "Mission has been deleted successfully !",
      mission
    });
  } catch (err) {
    const message = "An error has occured, please retry later.";
    res.json({ result: false, message, severity: "error", data: err });
    throw err;
  }
});

// Create new mission
router.post("/create", auth, async (req, res) => {
  try {
    if (!checkBody(req.body, ["projectName"])) {
      res.json({
        result: false,
        severity: "error",
        message: "Missing or empty fields"
      });
      return;
    }
    const { projectName } = req.body;
    const response = await Mission.findOne({ projectName: projectName });
    if (response === null) {
      const newMission = await new Mission(req.body);
      const mission = await newMission.save();
      if (mission.volunteer.toString() !== "639496d556430998cd5eabf5") {
        if (req.body.projectName !== "none") {
          await User.findByIdAndUpdate(req.body.volunteer, {
            mission: mission._id
          });
        }
      }
      const message = "Mission added successfully !";
      res.json({ result: true, severity: "success", message, data: mission });
    } else {
      res.json({
        result: false,
        severity: "error",
        message: "Mission already exists"
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
    if (!checkBody(req.body, ["projectName"])) {
      return res.json({ result: false, message: "Missing or empty fields" });
    }
    const response = await Mission.findByIdAndUpdate(
      req.body.missionId,
      req.body
    );
    const oldVolunteer = response.volunteer;
    if (req.body.volunteer._id !== "639496d556430998cd5eabf5") {
      await User.findByIdAndUpdate(req.body.volunteer._id, {
        mission: req.body.missionId
      });
    } else {
      await User.findByIdAndUpdate(oldVolunteer, {
        mission: "639494b656430998cd5eabb1"
      });
    }
    const message = "Mission updated successfully !";
    res.json({ result: true, severity: "success", message, data: response });
  } catch (err) {
    const message = "An error has occured, please retry later.";
    res.json({ result: false, message, severity: "error", data: err });
    throw err;
  }
});

module.exports = router;
