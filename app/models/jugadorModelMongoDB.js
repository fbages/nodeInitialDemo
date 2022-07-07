const { Schema } = require('mongoose');

const jugadorSchema = new Schema({
    id : {type: Number, default: 0},
    nom : String,
    percentatge : Number,
    registre : {type: Date, default : Date.now},
    partides :[{
        resultat : Number,
        dau1 : Number,
        dau2 : Number
    }]
});

module.exports = jugadorSchema;