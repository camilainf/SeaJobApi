const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Usuario o contraseña incorrecta.' });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(400).json({ message: 'Usuario o contraseña incorrecta.' });
        }

        // Genera un JWT
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token, user });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST: Crear un nuevo usuario
createUser = async (req, res) => {
    const { email, password } = req.body;

    // Verifica si el correo ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: 'El correo ya está en uso.' });
    }

    // Hashea la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crea el objeto user con la contraseña hasheada
    const user = new User({
        ...req.body,
        password: hashedPassword
    });

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
        if (!users) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET: Leer todos los usuarios
getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(user);
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
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
updateCalificationUser = async (req,res) => {
    const id = req.params.id;

    // Comprueba si la calificación es nula o no está definida
    if (req.body.calificacion === null || req.body.calificacion === undefined) {
        return res.status(400).json({ message: 'La calificación no puede ser nula.' });
    }

    try {
        // Encuentra al usuario por su ID
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Añade la nueva calificación al array de calificaciones
        user.calificacion.push(req.body.calificacion);

        // Calcula el promedio
        const avgCalificacion = user.calificacion.reduce((acc, curr) => acc + curr, 0) / user.calificacion.length;

        // Actualiza el documento en la base de datos con el nuevo array y el promedio
        const updatedUser = await User.updateOne(
            { _id: id }, 
            { $set: { calificacion: user.calificacion } }
        );

        res.json({ 
            message: 'Calificación actualizada con éxito', 
            averageCalification: avgCalificacion 
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    loginUser,
    updateCalificationUser,
};

