const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/service');

router.post('/', serviceController.createService);
router.get('/', serviceController.getAllServices);
router.get('/byCategory', serviceController.getServicesByCategory);

module.exports = router;
