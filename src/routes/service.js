const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/service');

router.post('/', serviceController.createService);

module.exports = router;
