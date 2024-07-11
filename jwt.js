const jwt = require('jsonwebtoken');

const jwtAuthMiddleware = async (req,res,next) =>{
    const authorization = req.headers.authorization;
    if(!authorization){
        res.status(401).json({error: 'Authorization error'});
    }

    const token = req.headers.authorization.split(' ')[1];
    if(!token){
        res.status(401).json({error: 'Token error'});
    }
    try{
        const decoded = await jwt.verify(token,process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch(error){
        res.status(401).json({error: 'Token error'});
        next();
    }
}

const generateToken = (userData) =>{
    return jwt.sign({userData},process.env.JWT_SECRET,{expiresIn:3000})
}

module.exports = {jwtAuthMiddleware,generateToken};