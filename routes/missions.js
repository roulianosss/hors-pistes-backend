const express = require("express");
const router = express.Router();
const Mission = require("../models/missions");
const User = require("../models/users");
const { checkBody } = require("../modules/checkBody");

// Fetch all Missions
router.get("/", async (req, res) => {
  const allMissions = await Mission.find()
    .populate("hostStructure")
    .populate("missionReferant")
    .populate("supportStructure")
    .populate("coordinationStructure")
    .populate("projectReferant")
    .populate("volunteer");
  res.json(allMissions);
});

// Fetch by Id
router.get("/:missionId", async (req, res) => {
  const mission = await Mission.findById(req.params.missionId)
    .populate("hostStructure")
    .populate("missionReferant")
    .populate("supportStructure")
    .populate("coordinationStructure")
    .populate("projectReferant")
    .populate("volunteer");
  res.json(mission);
});

// Delete By Id
router.delete("/:missionId/:userId", async (req, res) => {
  const mission = await Mission.findOneAndDelete({ _id: req.params.missionId });

  await User.findByIdAndUpdate(req.params.userId, {
    mission: "639494b656430998cd5eabb1"
  });
  res.json({
    result: true,
    severity: "success",
    message: "Mission has been deleted successfully !",
    mission
  });
});

// Create new mission
router.post("/create", async (req, res) => {
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
    if (req.body.volonteer !== "639496d556430998cd5eabf5") {
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
});

// Update a mission
router.post("/update", async (req, res, next) => {
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
});

module.exports = router;
