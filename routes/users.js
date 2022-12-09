const express = require("express");
const router = express.Router();
const User = require("../models/users");
const bcrypt = require("bcrypt");
const { checkBody } = require("../modules/checkBody");
const jwt = require("jsonwebtoken");
const privateKey = require("../auth/private_key");
const auth = require("../auth/auth");

router.get("/", async (req, res) => {
  const allUsers = await User.find();
  res.json(allUsers);
});

//fetch un utilisateur precis
router.get("/:userId", async (req, res) => {
  const user = await User.findById(req.params.userId);
  res.json(user);
});

// fetch un nouvel utilisateur
router.post("/signup", async (req, res) => {
  if (!checkBody(req.body, ["name", "password", "email", "birth", "surname"])) {
    res.json({ result: false, error: "Missing or empty fields" });
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
      res.json({ message, data: { _id, name, birth, surname, email }, token });
    } else {
      res.json({ result: false, error: "User already exists" });
    }
  } catch (error) {
    const message = "An error has occured, please retry later.";
    res.json({ message, data: error });
  }
});

router.post("/create", async (req, res) => {
  // if (!checkBody(req.body, ["name", "password", 'email', 'birth', 'surname'])) {
  //   res.json({ result: false, error: "Missing or empty fields" });
  //   return;
  // }
  try {
    const {
      missionId,
      name,
      surname,
      gender,
      email,
      birthDate,
      photo,
      birthCity,
      phone,
      degrees,
      occupation,
      IBAN,
      CESNumber,
      ICNumber,
      ICExpiration,
      adress,
      emergencyContact
    } = req.body;
    const { adressZipCode, adressCity, adressCountry } = adress;
    const {
      emergencyContactName,
      emergencyContactRelation,
      emergencyContactPhone
    } = emergencyContact;
    const response = await User.findOne({ email: email });
    if (response === null) {
      const password = "123";
      const hash = bcrypt.hashSync(password, 10);
      const newUser = await new User({
        missionId,
        name,
        surname,
        password: hash,
        gender,
        email,
        birthDate,
        photo,
        birthCity,
        phone,
        degrees,
        occupation,
        IBAN,
        CESNumber,
        ICNumber,
        ICExpiration,
        adress: {
          zipCode: adressZipCode,
          city: adressCity,
          country: adressCountry
        },
        emergencyContact: {
          name: emergencyContactName,
          relation: emergencyContactRelation,
          phone: emergencyContactPhone
        }
      });
      const user = await newUser.save();
      const { _id } = user;
      const token = jwt.sign({ userId: _id }, privateKey, { expiresIn: "24h" });
      const message = "User connected successfully !";
      res.json({ message, data: { _id, name, birth, surname, email }, token });
    } else {
      res.json({ result: false, error: "User already exists" });
    }
  } catch (error) {
    const message = "An error has occured, please retry later.";
    res.json({ message, data: error });
  }
});

router.post("/update", async (req, res, next) => {
  // if (
  //   !checkBody(req.body, ["projectName", "missionType", "startDate", "endDate"])
  // ) {
  //   res.json({ result: false, error: "Missing or empty fields" });
  //   return;
  // }

  const {
    missionId,
    userId,
    name,
    surname,
    gender,
    email,
    birthDate,
    photo,
    birthCity,
    phone,
    degrees,
    occupation,
    IBAN,
    CESNumber,
    ICNumber,
    ICExpiration,
    adress,
    emergencyContact
  } = req.body;
  const { adressZipCode, adressCity, adressCountry } = adress;
  const {
    emergencyContactName,
    emergencyContactRelation,
    emergencyContactPhone
  } = emergencyContact;

  const response = await User.findByIdAndUpdate(userId, {
    missionId,
    name,
    surname,
    gender,
    email,
    birthDate,
    photo,
    birthCity,
    phone,
    degrees,
    occupation,
    IBAN,
    CESNumber,
    ICNumber,
    ICExpiration,
    adress: {
      zipCode: adressZipCode,
      city: adressCity,
      country: adressCountry
    },
    emergencyContact: {
      name: emergencyContactName,
      relation: emergencyContactRelation,
      phone: emergencyContactPhone
    }
  })

  const message = "Mission updated successfully !";
  res.json({ message, data: response });
});

// fetch une connection utilisateur
router.post("/signin", async (req, res) => {
  if (!checkBody(req.body, ["username", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });
    if (user && bcrypt.compareSync(password, user.password)) {
      const { _id, email } = user;
      const token = jwt.sign({ userId: _id }, privateKey, { expiresIn: "24h" });
      const message = "User connected successfully !";
      res.json({ message, data: { _id, username, email }, token });
    } else {
      const message = "Password entered was incorrect.";
      res.json({ message });
    }
  } catch (error) {
    const message = "An error has occured, please retry later.";
    res.json({ message, data: error });
  }
});

// fetch une supression de tout les utilisateurs
router.delete("/allUsers", async (req, res) => {
  const deleteAllUsers = await User.deleteMany({});
  res.json(deleteAllUsers);
});

module.exports = router;
