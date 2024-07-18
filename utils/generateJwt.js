// generateJwt.js
const jwt = require('jsonwebtoken');

const generateJwtToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.EXPIRES_IN
    });
};

module.exports = generateJwtToken;
