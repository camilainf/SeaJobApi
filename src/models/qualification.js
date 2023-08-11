const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const qualificationSchema = new Schema({
    usuarioEvaluadorId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    usuarioEvaluadoId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    puntuacion: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comentario: {
        type: String
    }
});

module.exports = mongoose.model('Qualification', qualificationSchema);
