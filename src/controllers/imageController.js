// // imageController.js
const cloudinary = require('../configs/cloudinaryConfig');

exports.uploadImage = async (req, res) => {
    console.log("uploadImage");
    try {
        const result = await cloudinary.uploader.upload(req.body.image);

        res.json({
            success: true,
            imageUrl: result.secure_url
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al subir la imagen'
        });
    }
};
