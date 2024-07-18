const express = require('express');

const router = express.Router();

const userController = require('../controller/user.controller');
const authController = require('../controller/auth.controller');

const verifyToken = require('../middleware/verifyToken');

router.route('/')
    .get(userController.getAllUsers)


router.route("/signup")
    .post(authController.signUp);


router.route("/login")
    .post(authController.login);

router.route('/forgotPassword')
    .post(authController.forgetPassword);

router.route('/resetPassword/:token')
    .patch(authController.resetPassword);

router.route("/changeMyPassword/:userId")
    .patch(verifyToken, authController.updateMyPassword);

router.route("/signout/:userId")
    .delete(verifyToken, userController.signOut);


router.route("/:userId")
    .get(userController.getSingleUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);


module.exports = router;
