const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const serviceSchema = new Schema({
    titulo: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    ubicacion: {
        type: String,
        required: true
    },
    duracion: {
        type: String,
        required: true
    },
    usuarioPublicadorId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    usuarioTrabajadorId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    estado: {
        type: String,
        enum: ['pendiente', 'en progreso', 'completado'],
        default: 'pendiente'
    }
});

module.exports = mongoose.model('Service', serviceSchema);
