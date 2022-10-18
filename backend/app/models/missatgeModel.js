const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const missatgeSchema = new Schema({
    text : String,
    jugador : String,
    idXat : mongoose.ObjectId
});

module.exports = missatgeSchema;