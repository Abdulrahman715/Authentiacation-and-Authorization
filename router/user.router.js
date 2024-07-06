const express = require('express');

const router = express.Router();

const userController = require('../controller/user.controller');
const authController = require('../controller/auth.controller');

router.route('/')
    .get(userController.getAllUsers)


router.route("/signup")
    .post(authController.signUp);


router.route("/:userId")
    .get(userController.getSingleUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;
