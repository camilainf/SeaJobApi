
const express = require('express');
const router = express.Router();
const User = require('../models/Users');

// POST: Crear un nuevo usuario
router.post('/users', async (req, res) => {
    const user = new User(req.body);
    try {
        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// GET: Leer todos los usuarios
router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET BY ID: Leer todos los usuarios
router.get('/users/:id', async (req, res) => {
    const {id} = req.params;
    try {
        const users = await User.findById(id);
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT: Actualizar un usuario
router.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, password } = req.body;

    // Ambas formas sirven
    
    // Forma 1
    // User
    //     .updateOne({ _id: id }, { $set: {name, email, password} })
    //     .then((data) => res.json(data))
    //     .catch((error) => res.json({message: error}));

    // Forma 2
    try {
        const user = await User.updateOne({ _id: id }, { $set: {name, email, password} })
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

