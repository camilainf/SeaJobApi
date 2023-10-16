const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const valorationSchema = new mongoose.Schema({
    idServicio: {
        type: String,
        required: true,
        ref: 'Service'
    },
    idDueñoServicio: {
        type: String,
        required: true,
        ref: 'User'
    },
    idTrabajadorServicio: {
        type: String,
        required: true,
        ref: 'User'
    },
    dueñoValoro:{
        type: Boolean,
        default: false,
    },
    trabajadorValoro: {
        type: Boolean,
        default: false,
    },
    
});

module.exports = mongoose.model('Valoration', valorationSchema);
