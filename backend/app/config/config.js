//Variables d'entorn
const dotenv = require("dotenv");
dotenv.config();
const config = require("./config.json");

const mongoose = require("mongoose");
const jugadorSchema = require("../models/jugadorModel");
const missatgeSchema = require("../models/missatgeModel");
const xatgeSchema = require("../models/xatModel");
const crudService = require("../helpers/crudService");

module.exports = db = {};//fa la variable global accessible a tot el programa 

initialize().then(()=>{
    //Creacio XAT PRINCIPAL
    console.log('Creat xat principal'),
    crudService.crearXat('Principal') //sense jugadors, queda un null al primer  
}
);

async function initialize() {
    const { host, port, databaseName } = config.dbmongo;
    const user = process.env.DATABASEMONGO_USER;
    const password = process.env.DATABASEMONGO_PASSWORD;
    await mongoose.connect("mongodb://" + host + ":" + port + "/" + databaseName);
    console.log("Conectat a la base de dades de MongoDB");

    db.Jugadors = mongoose.model("Jugadors", jugadorSchema);
    db.Missatges = mongoose.model("Missatges", missatgeSchema);
    db.Xats = mongoose.model("Xats", xatgeSchema);

}