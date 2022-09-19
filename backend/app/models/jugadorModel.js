const { Schema } = require('mongoose');

const jugadorSchema = new Schema({
    nom : String,
    idsocketjugador : String,
    idsocketmissatge : String,
    idsocketxat : String,
    email: String,
    password: String
});

module.exports = jugadorSchema;