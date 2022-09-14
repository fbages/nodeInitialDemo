
exports.llistatGuanyadors = async (req, res, next) => {
    res.json(await serviceDb.rankingSorted());
}

exports.perdedor = async (req, res, next) => {
    res.json(await serviceDb.perdedor());
}

exports.guanyador = async (req, res, next) => {
    res.json(await serviceDb.guanyador());
}