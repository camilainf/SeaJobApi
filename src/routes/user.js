const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.post('/', userController.createUser);
router.get('', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.post('/login', userController.loginUser);
router.patch('/uptateCalification/:id', userController.updateCalificationUser)

module.exports = router;
