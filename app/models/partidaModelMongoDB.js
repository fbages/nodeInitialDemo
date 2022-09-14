const {Schema}= require('mongoose');

const partidaSchema = new Schema({
    idjugador : Number,
    resultat : Number,
    dau1 : Number,
    dau2 : Number
})

module.exports = partidaSchema;