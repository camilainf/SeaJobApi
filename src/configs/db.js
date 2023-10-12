const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

let gfs;

const connection = () => {
    mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB Atlas');

        // Inicializar stream
        gfs = Grid(mongoose.connection.db, mongoose.mongo);
        gfs.collection('uploads'); // Nombre de la colección
    })
    .catch((error) => console.error(error));
}

module.exports = {
    connection,
    getGfs: () => gfs
};
