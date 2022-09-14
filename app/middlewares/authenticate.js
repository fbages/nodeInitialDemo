const { secret } = require("../config/config.json");

module.exports = authenticate;

function authenticate(req, res, next) {
  const adminName = req.body.adminName;
  const adminPassword = req.body.adminPassword;

  if (
    adminName == process.env.ADMINNAME &&
    adminPassword == process.env.ADMINPASSWORD
  ) {
    return next();
  } else {
    res.status(403)
    return res.send({
      status:false,
      message:"admin incorrecte"
    });
  }
}
