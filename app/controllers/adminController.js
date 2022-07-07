//jasonwatmore.com
const jwt = require('jsonwebtoken');

exports.retornJWT = async (req,res,next) => {
    const token = jwt.sign({ sub: "admin" }, process.env.SECRET, { expiresIn: '7d' });
    res.send(token);
}

