const express = require('express');
const router = express.Router();
const Referant = require('../models/referants')

/* GET home page. */
router.get('/', async(req, res, next) => {
    const allReferants = await Referant.find();
    res.json(allReferants);
});

module.exports = router;
