const express = require('express');
const User = require('../models/user');

// POST: Crear un nuevo usuario
createUser = async (req, res) => {
    const user = new User(req.body);
    try {
        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// GET: Leer todos los usuarios
getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET: Leer todos los usuarios
getUserById = async (req, res) => {
    const {id} = req.params;
    try {
        const users = await User.findById(id);
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT: Actualizar un usuario
updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, password } = req.body;

    try {
        const user = await User.updateOne({ _id: id }, { $set: {name, email, password} })
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser
};

