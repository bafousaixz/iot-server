var express = require('express');
var router = express.Router();
var auth = require('../middleware/auth');
var Model = require('../models/user.model');

router.post('/', async(req, res) => {
    // Create a new user
    try {
        const user = new Model(req.body);
        user.role = 0;
        await user.save();
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
    res.send(req.user);
})

router.get('/list/:id', async(req, res) => {
    try {
        const id = req.params.id;
        const user = await Model.findById(id).exec();
        if (user.role === 1) {
            const result = await Model.find().exec();
            const users = result.filter(data => {
                return data._id.toString() !== id.toString()
            })
            res.send(users);
        } else {
            res.send('not have access');
        }
    } catch (error) {
        res.status(400).send(error);
    }
})


router.put('/me', auth, async(req, res) => {
    try {
        const u = req.user;
        u.set(req.body);
        const result = await u.save();
        res.send(result);
    } catch (error) {
        res.status(400).send(error);
    }
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
        const result = await Model.deleteOne({ _id: id }).exec();
        res.send(result);
    } catch (error) {
        res.status(500).send(error);
    }
})


module.exports = router;