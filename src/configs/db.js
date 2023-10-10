const mongoose = require('mongoose');

const connection = () => {
    mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((error) => console.error(error));
}

module.exports = () => {
    connection();
}
