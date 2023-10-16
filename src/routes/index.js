const express = require('express');
const router = express.Router();

router.use((req, res, next) => {
    // console.log(`Request URL: ${req.originalUrl}`);
    next();
});

const userRoutes = require('./user');
const serviceRoutes = require('./service');
const categoryRoutes = require('./category');
const offerRoutes = require('./offer');
const imageRoutes = require('./image');
const valorationRoutes = require('./valoration');

router.use('/users', userRoutes);
router.use('/services', serviceRoutes);
router.use('/categories', categoryRoutes);
router.use('/offers', offerRoutes);
router.use('/image', imageRoutes);
router.use('/valoration', valorationRoutes);

module.exports = router;
