const express = require('express');
const initDb = require('./src/configs/db')
const allRoutes = require("./src/routes/index");
const cors = require('cors');
require("dotenv").config();
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
const port = process.env.PORT || 9000;

// middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use('/api', allRoutes); // Asegúrate de que tus rutas estén después de los middlewares de bodyParser

// Iniciar Base de datos
initDb();

app.listen(port, '0.0.0.0', () => console.log(`server listening on ${port}`));
