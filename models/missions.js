const mongoose = require("mongoose")

const financialInformationsSchema = mongoose.Schema({
    travel: Number,
    greenTravel: Boolean,
    pocketMoney: Number,
    hostingStructure: Number,
    sendingStructure: Number,
    visa: Number,
    wifi: Number,
})

const contactSchema = mongoose.Schema({
    name: String,
    surname: String,
    email: String,
    phone: String
})

const missionSchema = mongoose.Schema({
    volunteer: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    missionId: String,
    missionType: String,
    projectName: String,
    hostStructure: { type: mongoose.Schema.Types.ObjectId, ref: 'structures' },
    coordinationStructure: { type: mongoose.Schema.Types.ObjectId, ref: 'structures' },
    supportStructure: { type: mongoose.Schema.Types.ObjectId, ref: 'structures' },
    startDate: Date,
    endDate: Date,
    subventionNumber: String,
    missionTask: String,
    financialInformations: financialInformationsSchema,
    projectReferant: { type: mongoose.Schema.Types.ObjectId, ref: 'referants' },
    missionReferant: contactSchema,
    practicalInformation: [String],
});

const Mission = mongoose.model("missions", missionSchema);

module.exports = Mission;