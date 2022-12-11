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
    phone: String
})

const structureSchema = mongoose.Schema({
    name: String,
    OIDNumber: String,
    qualityLabelHostNumber: String,
    adress: adressSchema,
    projectReferent: contactSchema,
    legalReferent: contactSchema,
});

const Structure = mongoose.model("structures", structureSchema);

module.exports = Structure;