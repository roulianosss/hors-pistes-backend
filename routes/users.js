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
  const allUsers = await User.find().populate("mission");
  res.json({ result: true, data: allUsers, severity: 'success', message: 'All users have been retrieved !' });
});

// fetch un utilisateur precis
router.get("/:userId", auth, async (req, res) => {
  const user = await User.findById(req.params.userId).populate("mission");
  res.json({ result: true, data: user, severity: 'success', message: 'User have been retrieved !' });
});

// delete an user
router.delete("/:userId/:missionId", auth, async (req, res) => {
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
});

// fetch une supression de tout les utilisateurs
router.delete("/allUsers", auth, async (req, res) => {
  const deleteAllUsers = await User.deleteMany({});
  res.json(deleteAllUsers);
});

router.post("/create", auth, async (req, res) => {
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
    const password = "123";
    const hash = bcrypt.hashSync(password, 10);
    const newUser = await new User({ ...req.body, password: hash });
    const user = await newUser.save();
    if (req.body.mission._id !== "639494b656430998cd5eabb1") {
      await Mission.findByIdAndUpdate(req.body.mission._id, {
        volunteer: user._id
      })
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
});

// Fetch un Update Utilisateur
router.post("/update", auth, async (req, res) => {
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
});

// SignIn a user
router.post("/signin", async (req, res) => {
  if (!checkBody(req.body, ["username", "password"])) {
    res.json({
      result: false,
      severity: "error",
      message: "Missing or empty fields"
    });
    return;
  }
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });
    if (user && bcrypt.compareSync(password, user.password)) {
      const { _id, email } = user;
      const token = jwt.sign({ userId: _id }, privateKey, { expiresIn: "24h" });
      const message = "Volunteer connected successfully !";
      res.json({
        result: true,
        severity: "success",
        message,
        data: { _id, username, email },
        token
      });
    } else {
      const message = "User and/or Password entered was incorrect.";
      res.json({ result: false, severity: "error", message });
    }
  } catch (error) {
    const message = "An error has occured, please retry later.";
    res.json({ result: false, message, severity: "error", data: error });
  }
});

// SignUp a user
router.post("/signup", async (req, res) => {
  if (!checkBody(req.body, ["name", "password", "email", "birth", "surname"])) {
    res.json({
      result: false,
      severity: "error",
      message: "Missing or empty fields"
    });
    return;
  }
  try {
    const { name, password, email, surname, birth } = req.body;
    const response = await User.findOne({ email: email });
    if (response === null) {
      const hash = bcrypt.hashSync(password, 10);
      const newUser = await new User({
        email,
        name,
        surname,
        birthDate: birth,
        password: hash
      });
      const user = await newUser.save();
      const { _id } = user;
      const token = jwt.sign({ userId: _id }, privateKey, { expiresIn: "24h" });
      const message = "User connected successfully !";
      res.json({
        result: true,
        message,
        data: { _id, name, birthDate, surname, email },
        token
      });
    } else {
      res.json({
        result: false,
        severity: "error",
        error: "User already exists"
      });
    }
  } catch (error) {
    const message = "An error has occured, please retry later.";
    res.json({ result: false, severity: "error", message, data: error });
  }
});

module.exports = router;
