const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const mongoose = require('mongoose');
const { getGfs } = require('../configs/db');


require("dotenv").config();
const storage = new GridFsStorage({
    url: process.env.MONGODB_URI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            const filename = file.originalname;
            const fileInfo = {
                filename: filename,
                bucketName: 'uploads'
            };
            resolve(fileInfo);
        });
    }
});

const upload = multer({ storage });

uploadImage = async (req, res) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ file: req.file });
    });
};

getImage = (req, res) => {
    console.log("Inicio de getImage");

    const gfs = getGfs();
    console.log("gfs obtenido:", !!gfs);
    const fileId = req.params.id;
    console.log(fileId)
    console.log(gfs.files)
    gfs.files.f({ _id: new mongoose.Types.ObjectId(fileId) }, (err, file) => {

        console.log("entra aqui")
        if (err) {
            console.error('Error al buscar el archivo:', err);
            return res.status(500).send('Error interno al buscar el archivo.');
        }

        if (!file || file.length === 0) {
            return res.status(404).json({ error: 'No file exists' });
        }

        if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
            const readstream = gfs.createReadStream(file.filename);
            
            readstream.on('error', function(err) {
                console.error('Error al leer el stream:', err);
                res.status(500).send('Error interno al intentar leer el archivo.');
            });

            readstream.pipe(res);
        } else {
            res.status(404).json({ error: 'Not an image' });
        }
    });
};


module.exports = {
    uploadImage,
    getImage,
};