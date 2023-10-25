const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const offerSchema = new Schema({
  idServicio: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Service'
  },
  idCreadorOferta: {
    type: mongoose.Schema.Types.ObjectId,
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
