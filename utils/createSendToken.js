const generateJwtToken = require('./generateJwt'); 
const cookies = require('cookies');
const httpStatusText = require('./httpStatusText');

const createSendToken = (user, statusCode, res) => {
    
    const token = generateJwtToken(user._id);

    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
        ),
        httpOnly: true,
    };

    if (process.env.NODE_ENV === 'production') cookieOptions = true;

    res.cookies("jwt", token, cookieOptions);

    res.status(statusCode).json({
        status: httpStatusText.SUCCESS,
        token,
        data: user
    });
};

module.exports = createSendToken;