const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offer');

router.post('/createOffer', offerController.offerToService);
router.get('/getOfferOfService/:id', offerController.getOfferOfService);
router.get('/getOfferAceptedOfService/:id', offerController.getOfferAceptedOfService);
router.patch('/acceptAnOffer/:id', offerController.acceptAnOffer)
module.exports = router;