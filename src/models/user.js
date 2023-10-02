const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    apellidoPaterno: {
        type: String,
        required: true
    },
    apellidoMaterno: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    telefono: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    imagenDePerfil: {
        type: String,
        default: ""
    },
    calificacion: {
        type: Number,
    },
});

module.exports = mongoose.model('User', userSchema);
