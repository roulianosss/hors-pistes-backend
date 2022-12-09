const mongoose = require("mongoose");



const adressSchema = mongoose.Schema({
  zipCode: String,
  city: String,
  country: String
})

const contactSchema = mongoose.Schema({
  name: String,
  relation: String,
  phone: Number
})

const userSchema = mongoose.Schema({
  name: String,
  surname: String,
  gender: String,
  email: String,
  password: String,
  photo: String,
  birthDate: Date,
  birthCity: String,
  phone: Number,
  degrees: String,
  occupation: String,
  IBAN: String,
  CESNumber: String,
  ICNumber: String,
  ICExpirationDate: String,
  adress: adressSchema,
  emergencyContact: contactSchema,
  mission: [{ type: mongoose.Schema.Types.ObjectId, ref: 'missions' }],
});

const User = mongoose.model("users", userSchema);

module.exports = User;
