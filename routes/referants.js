const express = require('express');
const router = express.Router();
const Referant = require('../models/referants')

/* GET home page. */
router.get('/', async(req, res, next) => {
    const allReferants = await Referant.find();
    res.json({ result: true, severity: "success", message: 'All referants have been retieved !', data: allReferants });
});

module.exports = router;
