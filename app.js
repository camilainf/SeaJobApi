const initDb = require('./src/configs/db');
const express = require('express');
const allRoutes = require("./src/routes/index");
const cors = require('cors');
require("dotenv").config();

const app = express();
app.use(cors());
const port = process.env.PORT || 9000;

// middleware
app.use(express.json());
app.use('/api', allRoutes);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


// Iniciar Base de datos
// initDb.connection();
initDb.connection();

app.listen(port, '0.0.0.0', () => console.log(`server listening on ${port}`));
