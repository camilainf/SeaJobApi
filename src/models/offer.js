const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const offerSchema = new Schema({
  idServicio: {
    type: String,
    required: true,
    ref: 'Service'
  },
  idCreadorOferta: {
    type: String,
    required: true,
    ref: 'User'
  },
  montoOfertado: {
    type: Number,
    required: true
  },
  estaEscogida: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Offer', offerSchema);
