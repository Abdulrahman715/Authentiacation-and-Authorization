const asyncWrapper = require('../middleware/asyncWrapper');
const User = require('../models/userModel');
const httpStatusText = require('../utils/httpStatusText');

const signUp = asyncWrapper(async (req, res, next) => {
    
    const newUser = await User.create(req.body);

    res.status(201).json({
        status: httpStatusText.SUCCESS,
        data: {
            newUser
        }
    });
});

module.exports = {
    signUp
}