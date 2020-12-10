const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const IOT = new Schema({
    type: {
        type: String,
        required: true
    },
    temp: {
        type: Number,
        required: true
    },
    rainflow: {
        type: Number,
        required: true
    },
    windspeed: {
        type: Number,
        required: true
    },
    detect_content: {
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    time: {
        type: Number,
        required: true
    },
    machine_id: {
        type: String,
        required: true
    }
});

iots = Mongoose.model("iots", IOT);

module.exports = iots;