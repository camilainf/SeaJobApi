const express = require('express');
const router = express.Router();
const valorationController = require('../controllers/valoration');

router.post('/', valorationController.createValoration);
router.get('/:id', valorationController.getValorationByIdService);
//router.patch('/actualizarEstado/:id', valorationController.);


module.exports = router;