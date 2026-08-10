var jwt = require('jsonwebtoken');
const JWT_SECRET = "ThisIsMySecretKey"; 


const fetchuser = (req,res,next)=>{
    //get the user from jwt token and add id to req object
    const token = req.header('auth-token');
    if(!token){
        return res.status(401).send({error: "Please authenticate using a valid token"});
    }

    // Allow a demo token for local development/testing
    if (token === 'demo-token') {
        req.user = { id: 'demo-user' };
        return next();
    }
   
    try {
         const data = jwt.verify(token, JWT_SECRET);
    req.user=data.user;
    next();
    } catch (error) {
        return res.status(401).send({error: "Please authenticate using a valid token"});
    }
}
module.exports = fetchuser;