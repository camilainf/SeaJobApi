const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/service');

router.post('/', serviceController.createService);
router.get('/', serviceController.getAllServices);
router.get('/byCategory', serviceController.getServicesByCategory);
router.get('/lastServices', serviceController.getLastServices);
router.get('/byUser', serviceController.getServicesByUser);
router.get('/topOfWeek', serviceController.getFeaturedServicesOfWeek);
router.get('/:id', serviceController.getServiceById);
router.put('/:id', serviceController.updateService);
router.patch('/:id', serviceController.updateServiceStatus);
router.post('/incrementClick/:id', serviceController.incrementClickCount);
router.get('/acceptedByUser/:id', serviceController.getServicesAcceptedByUser);
router.get('/offeredByUser/:id', serviceController.getServicesOfferedByUser);
router.delete('/:id', serviceController.deleteService);

module.exports = router;
