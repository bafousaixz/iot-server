var express = require('express');
var router = express.Router();
var IOT = require('../models/iot.model');

/* GET home page. */
router.get('/', async(req, res) => {
    try {
        const result = await IOT.find().exec();
        res.send(result);
    } catch (error) {
        res.status(400).send(error);
    }
})

router.get("/:id", async(req, res) => {
    try {
        const id = req.params.id;
        const result = await IOT.find({machine_id : id}).exec();
        res.send(result);
    } catch (error) {
        console.log(error)
        res.status(400).send(error);
    }
})

router.delete("/:id", async(req, res) => {
    try {
        var result = await IOT.deleteOne({ _id: req.params.id }).exec();
        res.send(result);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;