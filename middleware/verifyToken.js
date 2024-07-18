const jwt = require('jsonwebtoken');
const appError = require('../utils/appError');
const httpStatusText = require("../utils/httpStatusText");
const User = require('../models/userModel');

const verifyToken = async(req, res, next) => {
    const authHeader = req.headers["Authorization"] || req.headers["authorization"];

    if (!authHeader) {
        const error = appError.create("token is required", 401, httpStatusText.FAIL);
        return next(error);
    }

    const token = authHeader.split(" ")[1];
    try {
        const currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.currentUser = currentUser;

        next();
    } catch (err) {
        const error = appError.create("invalid token | token is expired", 401, httpStatusText.ERROR);
        return next(error);
    }
}

module.exports = verifyToken;