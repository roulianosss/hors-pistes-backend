const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: String,
  surname: String,
  email: String,
  password: String,
  birth: Date,
  token: String,

});

const User = mongoose.model("users", userSchema);

module.exports = User;
