const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn: "10000d",
    });
};


module.exports = generateToken;