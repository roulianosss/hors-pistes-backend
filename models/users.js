const mongoose = require("mongoose");



const addressSchema = mongoose.Schema({
  street: String,
  zipCode: String,
  city: String,
  country: String
})

const contactSchema = mongoose.Schema({
  name: String,
  relation: String,
  phone: String
})

const userSchema = mongoose.Schema({
  email: String,
  connectionCode: String,
  folderId: String,
  name: String,
  surname: String,
  gender: String,
  password: String,
  photo: String,
  passportImg: String,
  birthDate: Date,
  birthCity: String,
  phone: String,
  degrees: String,
  occupation: String,
  IBAN: String,
  CESNumber: String,
  ICNumber: String,
  ICExpirationDate: String,
  address: addressSchema,
  emergencyContact: contactSchema,
  mission: { type: mongoose.Schema.Types.ObjectId, ref: 'missions' },
});

const User = mongoose.model("users", userSchema);

module.exports = User;
