const mongoose = require("mongoose");

const adressSchema = mongoose.Schema({
    zipCode: String,
    city: String,
    country: String
})

const contactSchema = mongoose.Schema({
    name: String,
    surname: String,
    email: String,
    phoneNumber: String
})

const structureSchema = mongoose.Schema({
    name: String,
    adress: adressSchema,
    country: String,
    projectReferent: contactSchema,
    legalReferent: contactSchema,
    OIDNumber: String,
    qualityLabelHostNumber: String,
});

const Structure = mongoose.model("structures", structureSchema);

module.exports = Structure;