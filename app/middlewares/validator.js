const {param,body,query} = require('express-validator');

exports.valNom = [
    body('nom').default('Anonim').isLength({min:3}).withMessage("El nom ha de tenir com a mínim 3 caràcters"), 
]

exports.valIdNumberQueryMin = [
    param('id').isInt({ min: 1}).withMessage("'id' ha de ser un número més gran que 0"),
    body('nom').isLength({min:3,max:10}).withMessage("El body ha de tenir un key,'nom', amb un string com a valor de minim 3 caràcters i màxim 10"),
]

exports.valIdNumber = [
    param('id').isInt({ min: 1}).withMessage("'id' ha de ser un número més gran que 0"),
]