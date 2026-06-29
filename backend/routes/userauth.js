const jwt =require("jsonwebtoken");

const authenticatetoken = (req, res, next) => {
    console.log(req.headers);
    const authheader = req.headers["authorization"];
    const token = authheader && authheader.split(" ")[1];

    if(token ==null){
        return res.status(401).json({message: "authentication token required"});
    }
    jwt.verify(token,  "bookstore123",(err,user) => {
        if(err){
            return res
            .status(403)
            .json({message: "token expired. please sign in again"});    
        }
        req.user = user;
        next();
    });
};

module.exports = {authenticatetoken};