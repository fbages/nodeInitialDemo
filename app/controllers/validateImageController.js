//Controller que comprovar que la request sigui una imatge

exports.validateimage = (req, res) => {
    if (!req.files) {
        res.send({
            status: false,
            message: 'No has pujat cap fitxer'
        });
    } else if (req.files.imatge) {
        let tipoFitxer = req.files.imatge;
        let tipo = tipoFitxer.name.slice(-3).toUpperCase();
        console.log(tipo);
        if (tipo === "PNG" || tipo === "JPG" || tipo === "GIF") {
            res.send('Imatge rebuda correctament')
        } else {
            res.send('Fitxer pujat no és una imatge amb format "PNG", "JPG" o "GIF"');
        }
    } else {
        res.send('Fitxer pujat sense el KEY "imatge"')
    }
};
