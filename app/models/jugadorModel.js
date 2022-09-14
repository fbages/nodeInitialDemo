const { DataTypes } = require('sequelize');

module.exports = jugadorModel;

function jugadorModel(sequelize) {
    const attributes = {
        nom: { type: DataTypes.STRING, allowNull: false },
        percentatge: { type: DataTypes.DOUBLE(2,2), allowNull: true },
        data_registre: { type: DataTypes.DATE, allowNull: false },
    };

    const options = {
        timestamps: false
    };

    return sequelize.define('jugadors', attributes, options);
}