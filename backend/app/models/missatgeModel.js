const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const missatgeSchema = new Schema({
    text : String,
    jugador : mongoose.ObjectId,
    idXat : mongoose.ObjectId
});

module.exports = missatgeSchema;