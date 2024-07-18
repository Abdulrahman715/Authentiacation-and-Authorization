const appError = require('../utils/appError');
const httpStatusText = require("../utils/httpStatusText");

module.exports = (...roles) => { // function to reurn middleware
    //[Admin , Manager]
    
    return (req, res, next) => {

        // check Allowed Roles
        if (!roles.includes(req.currentUser.role)) {
            const error = appError.create("this role not authorized ", 403, httpStatusText.FAIL);
            return next(error);
        }

        next(); // to not stoping execution
    }
}