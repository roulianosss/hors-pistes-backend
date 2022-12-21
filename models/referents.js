const mongoose = require("mongoose");

const referentSchema = mongoose.Schema({
    name: String,
    surname: String,
    password: String,
    email: String,
    phoneNumber: String,
})

const Referent = mongoose.model("referents", referentSchema);

module.exports = Referent;