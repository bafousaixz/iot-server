const Mongoose = require('mongoose');
var Schema = Mongoose.Schema;
var jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const AuthSchema = new Schema({
    userId: {
        type: String,
        required: true
    },

    role: {
        type: Number,
        required: true
    },

    firstName: {
        type: String,
        required: false
    },

    lastName: {
        type: String,
        required: true
    },

    tel: {
        type: String,
        required: false
    },

    image: {
        type: String,
        required: false
    },
});

auth = Mongoose.model("auth", AuthSchema);

module.exports = auth;