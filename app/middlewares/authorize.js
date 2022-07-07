const jwt = require("jsonwebtoken");

module.exports = authorize;

function authorize(req, res, next) {
    try {
        const token = req.header('Authorization').slice(7);
        const verified = jwt.verify(token, process.env.SECRET);
        console.log("comprovat", verified);
        req.user = verified;
        next() // continuamos

    } catch (error) {
        return res.status(401).json({ error: 'Acceso denegado' })
    }
}
