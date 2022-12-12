const mongoose = require("mongoose");

const adminSchema = mongoose.Schema({
  email: String,
  password: String,
});

const Admin = mongoose.model("admins", adminSchema);

module.exports = Admin;
