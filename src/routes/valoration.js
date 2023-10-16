const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/valoration');

router.post('/', serviceController.createValoration);
router.get('/', serviceController.getValorationById);


module.exports = router;