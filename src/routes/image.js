const express = require('express');
const router = express.Router();
const imagesController = require('../controllers/image');

router.post('/upload', imagesController.uploadImage);
router.get('/image/:id', imagesController.getImage);

module.exports = router;