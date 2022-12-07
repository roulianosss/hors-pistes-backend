const mongoose = require("mongoose");



const adressSchema = mongoose.Schema({
  zipCode: String,
  city: String,
  country: String
})

const contactSchema = mongoose.Schema({
  name: String,
  relation: String,
  phoneNumber: Number
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
  phoneNumber: Number,
  adress: adressSchema,
  emergencyContact: contactSchema,
  degrees: String,
  occupation: String,
  IBAN: String,
  CESNumber: String,
  ICNumber: String,
  ICExpirationDate: String,
  mission: [{ type: mongoose.Schema.Types.ObjectId, ref: 'missions' }],
});

const User = mongoose.model("users", userSchema);

module.exports = User;
