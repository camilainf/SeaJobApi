const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const serviceSchema = new Schema({
  idCreador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  nombreServicio: {
    type: String,
    required: true
  },
  categoria: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  fechaSolicitud: {
    type: String,
    required: true
  },
  horaSolicitud: {
    type: String,
    required: true
  },
  direccion: {
    type: String,
    required: true
  },
  monto: {
    type: Number,
    required: true
  },
  imagen: {
    type: String,
    default: ""
  },
  estado: {
    type: Number,
    required: true,
    default: 1
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  clickCount: {
    type: Number,
    default: 0
  },
  lastClickDate: {
    type: Date,
    default: null
  },
  isOwnerActive: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Service', serviceSchema);
