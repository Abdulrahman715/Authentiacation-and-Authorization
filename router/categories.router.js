const express = require('express');

const router = express.Router();

const categoriesController = require("../controller/categories.controller");
const verifyToken = require('../middleware/verifyToken');
const userRoles = require('../utils/userRoles');
const allowedTo = require("../middleware/allowedTo");


router.route('/')
    .get(verifyToken,categoriesController.getAllCategories)
    .post(categoriesController.createCategory);

router.route('/:categoryId')
    .get(categoriesController.getSingleCategory)
    .patch(categoriesController.updateCategory)
    .delete(verifyToken, allowedTo(userRoles.ADMIN, userRoles.MANAGER), categoriesController.deleteCategory);

module.exports = router;