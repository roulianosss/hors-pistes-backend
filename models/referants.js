const mongoose = require("mongoose");

const referantSchema = mongoose.Schema({
    name: String,
    surname: String,
    password: String,
    email: String,
    phoneNumber: String,
})

const Referant = mongoose.model("referants", referantSchema);

module.exports = Referant;