const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category');

router.get('/', categoryController.getAllCategories);
router.post('/', categoryController.createCategory);

module.exports = router;