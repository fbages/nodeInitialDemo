//Controller que controlar si existeix un body amb propietat nom i respon enviant un JSON amb propietat "hora" que conté el dia i hora de la resposta
exports.usuariHora = (req, res) => {

    if (req.body.nom || req.body.nom=="") {
        if (req.body.nom) {
            res.send({
                 status:true,
                 'hora': new Date() });
        } else {
            res.send({
                status: false,
                message: `El JSON enviat no conté valor en la propietat "nom"`
            })
        }
    } else if (!req.body.nom ) {
        res.send({
            status: false,
            message: 'No hi ha cap fitxer JSON'
        });
    } 
}
