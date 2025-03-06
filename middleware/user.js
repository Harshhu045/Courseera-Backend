const jwt = require("jsonwebtoken");
const { JWT_USER_PASSWORD } = require("../config")


function userMiddleware(req, res, next) {
    const token = req.headers.token
    const decoded = jwt.verify(token, JWT_USER_PASSWORD);

    if(decoded){
        req.user.id = decoded.id;
        next()
    }
    else{
        res.status(403).json({
            message: "You are signed IN!"
        })
    }
}

module.exports = {
    userMiddleware: userMiddleware
}