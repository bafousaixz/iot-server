var express = require('express');
var router = express.Router();
var IOT = require('../models/iot.model');
var Model = require('../models/user.model');
var AWS = require('aws-sdk');
var station = require('../models/resources');

let s3Bucket = new AWS.S3({
    accessKeyId: "AKIAQUYJ6XTNNZWXTEFL",
    secretAccessKey: "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",
    region: "ap-southeast-1"
  });

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


router.post("/", async(req, res) => {
    const st = await station.findById(req.body.machine_id).exec();
    buf = Buffer.from(req.body.filename.replace(/^data:image\/\w+;base64,/, ""),'base64')
    const type = req.body.filename.split(';')[0].split('/')[1];
    const data = {
        Bucket: 'haiconmeo-static/cuong-image',
        Key: `${st.name}`,
        Body: buf,
        ContentEncoding: 'base64',
        ContentType: `image/${type}`
    };
    s3Bucket.putObject(data, (err, data) =>{
        if (err) { 
            console.log(err);
            console.log('Error uploading data: ', data); 
        } else {
            console.log('successfully uploaded the image!', data.Location);
        }
    });
    let rs = new IOT(req.body);
    Object.assign(rs, { filename: `https://haiconmeo-static.s3-ap-southeast-1.amazonaws.com/cuong-image/${st.name}` })
    let result = await rs.save();
    res.send(result);
    // try {
    //     let rs = new IOT(req.body);
    //     let result = await rs.save();
    //     res.send(result);
    // } catch (error) {
    //     res.status(400).send(error);
    // }
})

router.put("/:id", async(req, res) => {
    try {
        let value = await IOT.findById(req.params.id).exec();
        value.set(req.body);
        let result = await value.save();
        res.send(result);
    } catch (error) {
        console.log(error);
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