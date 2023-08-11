const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.post('/', userController.createUser);
router.get('', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);

module.exports = router;
