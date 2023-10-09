const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offer');

router.get('/', offerController.getAllOffers);
router.post('/createOffer', offerController.offerToService);

module.exports = router;