const { Schema } = require('mongoose');

const jugadorSchema = new Schema({
    nom : String,
    idsocketjugador : String,
    idsocketmissatge : String,
    idsocketxat : String
});

module.exports = jugadorSchema;