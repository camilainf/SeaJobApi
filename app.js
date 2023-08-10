const express = require('express');
const mongoose = require('mongoose');
require("dotenv").config();
const userRoutes = require("./src/routes/users");

const app = express();
const port = process.env.PORT || 9000;

// middleware
app.use(express.json());
app.use('/api', userRoutes);

// mongodb connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Connected to MongoDB Atlas'))
.catch((error) => console.error(error));

app.listen(port, () => console.log(`server listning to port ${port}`));