const { Schema } = require('mongoose');

const jugadorSchema = new Schema({
    nom : String,
    idsocket : String,
    idsocketmissatges : String
});

module.exports = jugadorSchema;