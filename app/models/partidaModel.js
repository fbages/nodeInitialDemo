const { DataTypes } = require('sequelize');

module.exports = partidaModel;

function partidaModel(sequelize) {
    const attributes = {
        idjugador: { type: DataTypes.INTEGER, allowNull: false },
        resultat: { type: DataTypes.INTEGER, allowNull: false },
        dau1: { type: DataTypes.INTEGER, allowNull: false },
        dau2: { type: DataTypes.INTEGER, allowNull: false },
    };

    const options = {
        timestamps: false
    };

    return sequelize.define('partides', attributes, options);
}