var express = require('express');
var router = express.Router();
var station = require('../models/resources');

router.get('/', async(req, res) => {
    try {
        const result = await station.find().exec();
        res.send(result);
    } catch (error) {
        res.status(400).send(error);
    }
})

router.get('/:id', async(req, res) => {
    try {
        const id = req.params.id;
        const result = await station.findById(id).exec();
        res.send(result);
    } catch (error) {
        res.status(400).send(error);
    }
})

router.delete('/:id', async(req, res) => {
    try {
        const id = req.params.id;
        const result = await station.deleteOne({ _id: id }).exec();
        res.send(result);
    } catch (error) {
        res.status(500).send(error);
    }
})

module.exports = router;