const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const serviceSchema = new Schema({
    idCreador: {
        type: Number,
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
        default: "" // Puedes establecer un valor predeterminado si lo deseas, por ejemplo, una imagen por defecto.
      },
      estado: {
        type: Number,
        required: true
      }
    });

module.exports = mongoose.model('Service', serviceSchema);
