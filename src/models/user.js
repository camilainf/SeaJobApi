const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    fotoPerfil: {
        type: String,
        default: ""
    },
    descripcion: {
        type: String,
        default: ""
    },
    calificaciones: [{
        type: Schema.Types.ObjectId,
        ref: 'Qualification'
    }],
    localizacion: {
        type: String,
        default: ""
    }
});

module.exports = mongoose.model('User', userSchema);
