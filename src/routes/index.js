const express = require('express');
const router = express.Router();

router.use((req, res, next) => {
    // console.log(`Request URL: ${req.originalUrl}`);
    next();
});

const userRoutes = require('./user');
const serviceRoutes = require('./service');

router.use('/users', userRoutes);
router.use('/services', serviceRoutes);

module.exports = router;
