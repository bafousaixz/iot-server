var express = require('express');
var router = express.Router();
var auth = require('../middleware/auth');
var auths = require('../models/auth');
var Model = require('../models/user.model');
var AWS = require('aws-sdk');
// var config = require('../s3_config.json')
// AWS.config.loadFromPath;
// AWS.config.update(
//     {
//         // "BUCKET": "dut-iot-image",
//         "REGION": "US East (Ohio) us-east-2",
//         "AWS_ACCESS_KEY": "AKIAQ2I6BF3TDH45OGLJ",
//         "AWS_SECRET_KEY": "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"
//     }
// );
// var s3Bucket = new AWS.S3( { params: {Bucket: 'dut-iot-image'} } );
let s3Bucket = new AWS.S3({
    accessKeyId: "AKIAQUYJ6XTNNZWXTEFL",
    secretAccessKey: "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",
    region: "ap-southeast-1"
  });
router.post('/', async(req, res) => {
    // Create a new user
    try {
        const { lastName, username, password, image } = req.body
        const user = new Model({username, password});
        const auth = new auths({lastName, image})
        const result = await user.save();
        auth.role = 1;
        auth.userId = result._id;
        await auth.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }
})

router.post('/login', async(req, res) => {
    //Login a registered user
    try {
        const { username, password } = req.body;
        const user = await Model.findByCredentials(username, password);
        if (!user) {
            return res.status(401).send({ error: 'Login failed! Check authentication credentials' });
        }
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }
})

router.get('/me', auth, async(req, res) => {
    const users = await auths.find({ userId: req.user._id }).exec();
    user = users[0]
    res.send(user);
})

router.get('/list/:id', async(req, res) => {
    try {
        const id = req.params.id;
        console.log(id)
        const user = await auths.find({ userId: id }).exec();
        console.log(user)
        if (user[0].role === 1) {
            const result = await auths.find().exec();
            const users = result.filter(data => {
                return data._id.toString() !== id.toString()
            })
            res.send(result);
        } else {
            res.send('not have access');
        }
    } catch (error) {
        res.status(400).send(error);
    }
})


router.put('/me', auth, async(req, res) => {
    // console.log(req.body.image)
    if (req.body.image) {
        buf = Buffer.from(req.body.image.replace(/^data:image\/\w+;base64,/, ""),'base64')
        const type = req.body.image.split(';')[0].split('/')[1];
        const data = {
            Bucket: 'haiconmeo-static/cuong-image',
            Key: `${req.body._id}`,
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
    }
        // const u = req.user;
        const uarr = await auths.find({ userId: req.user._id }).exec();
        u = uarr[0]
        u.set(req.body);
        Object.assign(u, { image: `https://haiconmeo-static.s3-ap-southeast-1.amazonaws.com/cuong-image/${req.body._id}` });
        const result = await u.save();
        res.send(result);
    // try {
    //     const u = req.user;
    //     u.set(req.body);
    //     const result = await u.save();
    //     res.send(result);
    // } catch (error) {
    //     res.status(400).send(error);
    // }
})

router.post('/me/logout', auth, async(req, res) => {
    // Log user out of the application
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token;
        })
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send(error);
    }
})

router.post('/me/logoutall', auth, async(req, res) => {
    // Log user out of all devices
    try {
        req.user.tokens.splice(0, req.user.tokens.length);
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send(error);
    }
})

router.delete('/:id', async(req, res) => {
    try {
        const id = req.params.id;
        console.log(id)
        const result = await auths.deleteOne({ userId: id }).exec();
        res.send(result);
    } catch (error) {
        res.status(500).send(error);
    }
})


module.exports = router;