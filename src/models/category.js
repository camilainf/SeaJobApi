const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    imagen:{
        type: String,
        default: ""
    }
});

module.exports = mongoose.model('Category', categorySchema);
