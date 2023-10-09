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

router.use('/users', userRoutes);
router.use('/services', serviceRoutes);
router.use('/categories', categoryRoutes);
router.use('/offers', offerRoutes);

module.exports = router;
