const mongoose = require("mongoose");

const addressSchema = mongoose.Schema({
  street: String,
  zipCode: String,
  city: String,
  country: String
});

const contactSchema = mongoose.Schema({
  name: String,
  surname: String,
  relation: String,
  phone: String
});

const folderIdsSchema = mongoose.Schema({
  mainFolderId: String,
  toValidateFolderId: String,
  toSignFolderId: String,
  completeFolderId: String
});

const userSchema = mongoose.Schema({
  email: String,
  connectionCode: String,
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
  folderIds: folderIdsSchema,
  address: addressSchema,
  emergencyContact: contactSchema,
  mission: { type: mongoose.Schema.Types.ObjectId, ref: "missions" }
});

const User = mongoose.model("users", userSchema);

module.exports = User;
