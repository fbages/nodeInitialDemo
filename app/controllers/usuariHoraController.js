//Controller que controlar si existeix un body amb propietat nom i respon enviant un JSON amb propietat "hora" que conté el dia i hora de la resposta
exports.usuariHora = (req, res) => {

    if (!req.body) {
        res.send({
            status: false,
            message: 'No hi ha cap fitxer JSON'
        });
    } else if (req.body) {
        if (req.body) {
            console.log(req.body.nom);
            res.send({ 'hora': new Date() });
        } else {
            res.send({
                status: false,
                message: 'El Json enviat no conté la propietat "nom"'
            })
        }
    }
}
