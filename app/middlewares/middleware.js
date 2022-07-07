//Custom middlewares 

exports.cacheHeader = (req,res,next) => {
        res.set('Cache-Control', 'no-cache');
    next();
}

exports.authHeader = (req,res,next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({ status:false, error: 'Unauthorized!' });
      }
    next();
}