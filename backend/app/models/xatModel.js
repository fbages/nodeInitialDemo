const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const xatSchema = new Schema({
    nomxat : String,
    jugadors : [{
        type: mongoose.ObjectId,
    }],
});

module.exports = xatSchema;