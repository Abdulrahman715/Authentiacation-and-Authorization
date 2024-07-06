const User = require('../models/userModel');

const httpStatusText = require('../utils/httpStatusText');
const asyncWrapper = require('../middleware/asyncWrapper');
const appError = require('../utils/appError');

const getAllUsers = asyncWrapper(async (req, res, next) => {
    
    const users = await User.find();

    res.status(200).json({
        status: httpStatusText.SUCCESS,
        data: {
            users
        }
    })
});

const getSingleUser = asyncWrapper(async (req, res, next) => {
    
    const user = await User.findById(req.params.userId);

    if (!user) {
        const error = appError.create("this user not found", 404, httpStatusText.FAIL);
        return next(error);
    }

    res.status(200).json({
        status: httpStatusText.SUCCESS,
        data: {
            user
        }
    })
});

const updateUser = asyncWrapper(async (req, res, next) => {
    
    const userId = req.params.userId;

    const updatedUser = await User.findByIdAndUpdate(userId, { $set: { ...req.body } });

    if (!updatedUser) {
        const error = appError.create("this user not found to update", 404, httpStatusText.FAIL);
        return next(error);
    }

    res.status(200).json({
        status: httpStatusText.SUCCESS,
        data: {
            updatedUser
        }
    });
});

const deleteUser = asyncWrapper(async (req, res, next) => {
    const deletedUser = await User.deleteOne({ _id: req.params.userId });

    res.status(200).json({
        status: httpStatusText.SUCCESS,
        data: null,
        message: "user Deleted successfully",
    });
});

module.exports = {
    getAllUsers,
    getSingleUser,
    updateUser,
    deleteUser
}