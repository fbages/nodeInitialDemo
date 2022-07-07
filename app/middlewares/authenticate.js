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
    return res.send("admin incorrecte");
  }
}
