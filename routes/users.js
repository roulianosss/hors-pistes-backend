const express = require("express");
const router = express.Router();
const User = require("../models/users");
const Mission = require("../models/missions");
const bcrypt = require("bcrypt");
const { checkBody } = require("../modules/checkBody");
const jwt = require("jsonwebtoken");
const privateKey = require("../auth/private_key");
const auth = require("../auth/auth");

// fetch all users
router.get("/", auth, async (req, res) => {
  try {
    const allUsers = await User.find().populate("mission");
    res.json({
      result: true,
      data: allUsers,
      severity: "success",
      message: "All users have been retrieved !"
    });
  } catch (err) {
    const message = "An error has occured, please retry later.";
    res.json({ result: false, message, severity: "error", data: err });
    throw err;
  }
});

// fetch un utilisateur precis
router.get("/:userId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("mission");
    res.json({
      result: true,
      data: user,
      severity: "success",
      message: "User have been retrieved !"
    });
  } catch (err) {
    const message = "An error has occured, please retry later.";
    res.json({ result: false, message, severity: "error", data: err });
    throw err;
  }
});

// delete an user
router.delete("/:userId/:missionId", auth, async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ _id: req.params.userId });
    await Mission.findByIdAndUpdate(req.params.missionId, {
      volunteer: "639496d556430998cd5eabf5"
    });
    res.json({
      result: true,
      severity: "success",
      message: "User has been deleted successfully !",
      userInfo: user
    });
  } catch (err) {
    const message = "An error has occured, please retry later.";
    res.json({ result: false, message, severity: "error", data: err });
    throw err;
  }
});

// fetch une supression de tout les utilisateurs
router.delete("/allUsers", auth, async (req, res) => {
  try {
    const deleteAllUsers = await User.deleteMany({});
    res.json(deleteAllUsers);
  } catch (err) {
    const message = "An error has occured, please retry later.";
    res.json({ result: false, message, severity: "error", data: err });
    throw err;
  }
});

router.post("/create", auth, async (req, res) => {
  try {
    if (!checkBody(req.body, ["email"])) {
      res.json({
        result: false,
        severity: "error",
        message: "Missing or empty fields"
      });
      return;
    }
    const response = await User.findOne({ email: req.body.email });
    if (response === null) {
      const newUser = await new User({
        ...req.body,
        email: req.body.email.toLowerCase()
      });
      const user = await newUser.save();
      if (user.mission.toString() !== "639494b656430998cd5eabb1") {
        await Mission.findByIdAndUpdate(req.body.mission._id, {
          volunteer: user._id
        });
      }
      const message = "User created successfully !";
      res.json({ result: true, severity: "success", message, data: user });
    } else {
      res.json({
        result: false,
        severity: "error",
        message: "User already exists"
      });
    }
  } catch (err) {
    const message = "An error has occured, please retry later.";
    res.json({ result: false, message, severity: "error", data: err });
    throw err;
  }
});

// Fetch un Update Utilisateur
router.post("/update", auth, async (req, res) => {
  try {
    if (!checkBody(req.body, ["email"])) {
      res.json({
        result: false,
        severity: "error",
        message: "Missing or empty fields"
      });
      return;
    }
    const response = await User.findByIdAndUpdate(req.body.userId, req.body);
    const oldMission = response.mission;
    if (req.body.mission._id !== "639494b656430998cd5eabb1") {
      await Mission.findByIdAndUpdate(req.body.mission._id, {
        volunteer: req.body.userId
      });
    } else {
      await Mission.findByIdAndUpdate(oldMission, {
        volunteer: "639496d556430998cd5eabf5"
      });
    }
    const message = "Volunteer updated successfully !";
    res.json({ result: true, severity: "success", message, data: response });
  } catch (err) {
    const message = "An error has occured, please retry later.";
    res.json({ result: false, message, severity: "error", data: err });
    throw err;
  }
});

// First Connection
router.post("/firstConnection", async (req, res) => {
  try {
    if (!checkBody(req.body, ["email", "connectionCode"])) {
      res.json({
        result: false,
        severity: "error",
        message: "Missing or empty fields"
      });
      return;
    }

    const { email, connectionCode } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (user && connectionCode === user.connectionCode) {
      const token = jwt.sign({ userId: user._id }, privateKey, {
        expiresIn: "24h"
      });
      const message = "Volunteer connected successfully !";
      res.json({
        result: true,
        severity: "success",
        message,
        data: user,
        token
      });
    } else {
      const message = "User and/or Password entered was incorrect.";
      res.json({ result: false, severity: "error", message });
    }
  } catch (err) {
    const message = "An error has occured, please retry later.";
    res.json({ result: false, message, severity: "error", data: err });
    throw err;
  }
});

// SignIn a user
router.post("/signin", async (req, res) => {
  try {
    if (!checkBody(req.body, ["email", "password"])) {
      res.json({
        result: false,
        severity: "error",
        message: "Missing or empty fields"
      });
      return;
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (user && bcrypt.compareSync(password, user.password)) {
      const { _id, email } = user;
      const token = jwt.sign({ userId: _id }, privateKey, { expiresIn: "24h" });
      const message = "Volunteer connected successfully !";
      res.json({
        result: true,
        severity: "success",
        message,
        data: user,
        token
      });
    } else {
      const message = "User and/or Password entered was incorrect.";
      res.json({ result: false, severity: "error", message });
    }
  } catch (err) {
    const message = "An error has occured, please retry later.";
    res.json({ result: false, message, severity: "error", data: err });
    throw err;
  }
});

// SignUp a user
router.post("/signup", async (req, res) => {
  console.log(req.body);
  try {
    if (!checkBody(req.body, ["password", "email"])) {
      res.json({
        result: false,
        severity: "error",
        message: "Missing or empty fields"
      });
      return;
    }

    const { password, email } = req.body;

    const hash = bcrypt.hashSync(password, 10);
    const user = await User.findOneAndUpdate(
      { email: email },
      {
        ...req.body,
        email: email.toLowerCase(),
        password: hash
      }
    );
    const { _id } = user;
    const token = jwt.sign({ userId: _id }, privateKey, { expiresIn: "24h" });
    const message = "User connected successfully !";
    res.json({
      result: true,
      message,
      data: { _id, email },
      token
    });
  } catch (err) {
    const message = "An error has occured, please retry later.";
    res.json({ result: false, message, severity: "error", data: err });
    throw err;
  }
});

module.exports = router;
