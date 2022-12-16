const express = require("express");
const router = express.Router();
const Admin = require("../models/admins");
const Mission = require("../models/missions");
const bcrypt = require("bcrypt");
const { checkBody } = require("../modules/checkBody");
const jwt = require("jsonwebtoken");
const privateKey = require("../auth/private_key");
const auth = require("../auth/auth");

// fetch all users
router.get("/", async (req, res) => {
  try {
    const allAdmins = await Admin.find();
    res.json(allAdmins);
  } catch (err) {
    const message = "An error has occured, please retry later.";
    res.json({ result: false, message, severity: "error", data: err });
    throw err;
  }
});

// fetch un utilisateur precis
router.get("/:adminId", async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.adminId);
    res.json(admin);
  } catch (err) {
    const message = "An error has occured, please retry later.";
    res.json({ result: false, message, severity: "error", data: err });
    throw err;
  } 
});

// delete an user
router.delete("/:adminId/", async (req, res) => {
  try {
    const admin = await Admin.findOneAndDelete({ _id: req.params.adminId });
    res.json({
      result: true,
      severity: "success",
      message: "User has been deleted successfully !",
      userInfo: admin
    });
  } catch (err) {
    const message = "An error has occured, please retry later.";
    res.json({ result: false, message, severity: "error", data: err });
    throw err;
  }
});

// fetch une supression de tout les utilisateurs
router.delete("/allAdmins", async (req, res) => {
  try {
    const deleteAllAdmins = await User.deleteMany({});
    res.json(deleteAllAdmins);
  } catch (err) {
    const message = "An error has occured, please retry later.";
    res.json({ result: false, message, severity: "error", data: err });
    throw err;
  }
});

router.post("/create", async (req, res) => {
  try {
    if (!checkBody(req.body, ["email", "password"])) {
      res.json({
        result: false,
        severity: "error",
        message: "Missing or empty fields"
      });
      return;
    }
    const response = await Admin.findOne({ email: req.body.email });
    if (response === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);
      const newAdmin = await new Admin({ ...req.body, password: hash });
      const admin = await newAdmin.save();
      const message = "Admin created successfully !";
      res.json({ result: true, severity: "success", message, data: admin });
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
router.post("/update", async (req, res) => {
  try {
    if (!checkBody(req.body, ["email", "password"])) {
      res.json({
        result: false,
        severity: "error",
        message: "Missing or empty fields"
      });
      return;
    }
    const hash = bcrypt.hashSync(req.body.password, 10);
    const response = await Admin.findAndUpdate(
      { email: req.body.email },
      { ...req.body, password: hash }
    );

    const message = "Admin updated successfully !";
    res.json({ result: true, severity: "success", message, data: response });
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
    const admin = await Admin.findOne({ email: email });
    if (admin && bcrypt.compareSync(password, admin.password)) {
      const { _id, email } = admin;
      const token = jwt.sign({ connectedId: _id }, privateKey, {
        expiresIn: "24h"
      });
      const message = "Admin connected successfully !";
      res.json({
        result: true,
        severity: "success",
        message,
        data: { _id, email },
        token
      });
    } else {
      const message = "Password entered was incorrect.";
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
    const response = await Admin.findOne({ email: email });
    if (response === null) {
      const hash = bcrypt.hashSync(password, 10);
      const newAdmin = await new Admin({
        email,
        password: hash
      });
      const admin = await newAdmin.save();
      const { _id } = admin;
      const token = jwt.sign({ connectedId: _id }, privateKey, {
        expiresIn: "24h"
      });
      const message = "Admin connected successfully !";
      res.json({
        result: true,
        message,
        data: { _id, email },
        token
      });
    } else {
      res.json({
        result: false,
        severity: "error",
        error: "User already exists"
      });
    }
  } catch (err) {
    const message = "An error has occured, please retry later.";
    res.json({ result: false, message, severity: "error", data: err });
    throw err;
  }
});

module.exports = router;
