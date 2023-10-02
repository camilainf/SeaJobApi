const mongoose = require('mongoose');

const categorySchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    imagen:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Category', categorySchema);
