const express = require('express');
const initDb = require('./src/configs/db')
const allRoutes = require("./src/routes/index");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 9000;

// middleware
app.use(express.json());
app.use('/api', allRoutes);

// Iniciar Base de datos
initDb();

app.listen(port, () => console.log(`server listning to port ${port}`));