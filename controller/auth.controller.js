const asyncWrapper = require('../middleware/asyncWrapper');
const User = require('../models/userModel');
const httpStatusText = require('../utils/httpStatusText');
const appError = require('../utils/appError');
const generateJwtToken = require('../utils/generateJwt');  // Import the generateJwtToken function
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

const signUp = asyncWrapper(async (req, res, next) => {

    const newUser = await User.create(req.body);

    const token = generateJwtToken(newUser._id, newUser.role); // Use the function to generate the token

    res.status(201).json({
        status: httpStatusText.SUCCESS,
        data: {
            newUser
        },
        token
    });
});

const login = asyncWrapper(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        const error = appError.create("please enter your email and password", 400, httpStatusText.FAIL);
        return next(error);
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !await user.correctPassword(password, user.password)) {
        const error = appError.create("Incorrect email and password", 401, httpStatusText.FAIL);
        return next(error);
    }

    const token = generateJwtToken(user._id);  // Use the function to generate the token

    res.status(200).json({
        status: httpStatusText.SUCCESS,
        data: {
            token
        }
    });
});

const forgetPassword = asyncWrapper(async (req, res, next) => {
    
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        const error = appError.create("this email not found", 404, httpStatusText.FAIL);
        return next(error);
    }

    const resetToken = user.createPasswordResetToken();

    await user.save({ validateBeforeSave: false });

    // send email to user

    const resetUrl = `${req.protocol}://${req.get('host')}/api/users/resetPassword/${resetToken}`;

    const message = `Forget your password ? submit a patch request with your new password and passwordConfirm to :${resetUrl}.\n if you didn't forget your password , please ignore this email!`;

    try {
        await sendEmail({
            email: user.email,
            subject: `your password reset token (valid for 10 min)`,
            message
        });

        res.status(200).json({
            status: httpStatusText.SUCCESS,
            data: {
                message: "token send to email",
            }
        });

    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        await user.save({ validateBeforeSave: false });

        const error = appError.create("something wrong , try again later", 500, httpStatusText.FAIL);
        return next(error);
    }
});

const resetPassword = asyncWrapper(async (req, res, next) => {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
        const error = appError.create("token invalid or expires", 400, httpStatusText.FAIL);
        return next(error);
    }

    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetToken = undefined;

    await user.save();

    const token = generateJwtToken(user._id);

    res.status(200).json({
        status: httpStatusText.SUCCESS,
        data: {
            token
        }
    });
});

const updateMyPassword = asyncWrapper(async (req, res, next) => {
    
    const user = await User.findById(req.params.userId).select('+password');

    if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
        const error = appError.create("your current pass is wrong", 401, httpStatusText.FAIL);
        return next(error);
    }

    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    await user.save();

    const token = generateJwtToken(user._id);

    res.status(200).json({
        status: httpStatusText.SUCCESS,
        data: {
            token
        }
    });
})

module.exports = {
    signUp,
    login,
    forgetPassword,
    resetPassword,
    updateMyPassword
};
