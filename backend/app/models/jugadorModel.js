const { Schema } = require('mongoose');

const jugadorSchema = new Schema({
    nom : String
});

module.exports = jugadorSchema;