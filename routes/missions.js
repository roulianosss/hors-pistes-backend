const express = require("express");
const router = express.Router();
const Mission = require("../models/missions");
const { checkBody } = require("../modules/checkBody");

/* GET home page. */
router.get("/", async (req, res) => {
  const allMissions = await Mission.find()
    .populate("hostStructure")
    .populate("missionReferant")
    .populate("supportStructure")
    .populate("coordinationStructure")
    .populate("projectReferant");
  res.json(allMissions);
});

router.get("/:id", async (req, res) => {
  const mission = await Mission.findById(req.params.id)
    .populate("hostStructure")
    .populate("missionReferant")
    .populate("supportStructure")
    .populate("coordinationStructure")
    .populate("projectReferant");
  res.json(mission);
});

router.post("/create", async (req, res, next) => {
  if (
    !checkBody(req.body, ["projectName", "missionType", "startDate", "endDate"])
  ) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  const {
    projectName,
    missionType,
    hostStructure,
    coordinationStructure,
    supportStructure,
    startDate,
    endDate,
    subventionNumber,
    missionTask,
    practicalInformation,
    financialInformations,
    missionReferant,
    projectReferant
  } = req.body;

  const {
    travel,
    greenTravel,
    pocketMoney,
    hostingStructure,
    sendingStructure,
    visa,
    wifi
  } = financialInformations;

  const {
    missionReferantName,
    missionReferantSurname,
    missionReferantEmail,
    missionReferantPhone
  } = missionReferant;

  console.log(missionReferant);
  const response = await Mission.findOne({ projectName: projectName });
  if (response === null) {
    const newUser = await new Mission({
      projectName,
      missionType,
      hostStructure,
      coordinationStructure,
      supportStructure,
      startDate,
      endDate,
      subventionNumber,
      missionTask,
      projectReferant,
      practicalInformation,
      financialInformations: {
        travel,
        greenTravel,
        pocketMoney,
        hostingStructure,
        sendingStructure,
        visa,
        wifi
      },
      missionReferant: {
        name: missionReferantName,
        surname: missionReferantSurname,
        email: missionReferantEmail,
        phone: missionReferantPhone
      }
    });
    const mission = await newUser.save();
    const message = "Mission added successfully !";
    res.json({ message, data: mission });
  } else {
    res.json({ result: false, error: "Mission already exists" });
  }
});

router.post("/update", async (req, res, next) => {
  if (
    !checkBody(req.body, ["projectName", "missionType", "startDate", "endDate"])
  ) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  const {
    missionId,
    projectName,
    missionType,
    hostStructure,
    coordinationStructure,
    supportStructure,
    startDate,
    endDate,
    subventionNumber,
    missionTask,
    practicalInformation,
    financialInformations,
    missionReferant,
    projectReferant
  } = req.body;

  const {
    travel,
    greenTravel,
    pocketMoney,
    hostingStructure,
    sendingStructure,
    visa,
    wifi
  } = financialInformations;

  const {
    missionReferantName,
    missionReferantSurname,
    missionReferantEmail,
    missionReferantPhone
  } = missionReferant;

  console.log(missionReferant);
  const response = await Mission.findByIdAndUpdate(missionId, {
    projectName,
    missionType,
    hostStructure,
    coordinationStructure,
    supportStructure,
    startDate,
    endDate,
    subventionNumber,
    missionTask,
    projectReferant,
    practicalInformation,
    financialInformations: {
      travel,
      greenTravel,
      pocketMoney,
      hostingStructure,
      sendingStructure,
      visa,
      wifi
    },
    missionReferant: {
      name: missionReferantName,
      surname: missionReferantSurname,
      email: missionReferantEmail,
      phone: missionReferantPhone
    }
  });
  console.log(response);

  const message = "Mission updated successfully !";
  res.json({ message, data: response });
});

module.exports = router;
