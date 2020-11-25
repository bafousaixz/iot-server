
const Mongoose = require('mongoose');
var Schema = Mongoose.Schema;

const StationsSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    machine_id: {
        type: String,
    },
    name: {
        type: String,
    },
    place: {
        type: String,
    },
});

station = Mongoose.model("stations", StationsSchema);

module.exports = station;