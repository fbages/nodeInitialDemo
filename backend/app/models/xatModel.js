const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const xatSchema = new Schema({
    nomXat : String,
    jugadors : [{
        type: mongoose.ObjectId,
    }],
});

module.exports = xatSchema;