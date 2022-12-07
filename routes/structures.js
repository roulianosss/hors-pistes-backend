const express = require('express');
const router = express.Router();
const Structure = require('../models/structures')

/* GET home page. */
router.get('/', async(req, res, next) => {
    const allStructures = await Structure.find();
    res.json(allStructures);
});

module.exports = router;
