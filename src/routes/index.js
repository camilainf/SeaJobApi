const express = require('express');
const router = express.Router();

router.use((req, res, next) => {
    console.log(`Request URL: ${req.originalUrl}`);
    next();
});

const userRoutes = require('./user');
// const productoRoutes = require('./productos');

router.use('/users', userRoutes);
// router.use('/productos', productoRoutes);

module.exports = router;
