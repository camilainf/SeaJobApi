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

// PUT: Actualizar la foto de perfil de un usuario
updateUserProfilePic = async (req, res) => {
    const { id } = req.params;
    const { imageUrl } = req.body;
    console.log("IMAGEN URL", imageUrl);

    if (!imageUrl) {
        return res.status(400).json({ message: 'La URL de la imagen es requerida.' });
    }

    try {
        const updatedUser = await User.updateOne({ _id: id }, { $set: { imagenDePerfil: imageUrl } });
        if (updatedUser.nModified === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado o no se realizó ninguna modificación.' });
        }
        res.json({ message: 'Foto de perfil actualizada con éxito.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT: Actualizar un usuario
updateUser = async (req, res) => {
    const { id } = req.params;
    const updates = req.body; // Esto contendrá todos los campos enviados en la solicitud para actualizar

    // No deberíamos permitir que el usuario actualice directamente algunos campos sensibles como 'password'.
    if (updates.password) {
        return res.status(400).json({ message: 'No se permite la actualización directa de la contraseña.' });
    }

    try {
        // Encuentra al usuario por ID
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Actualiza cada campo enviado en la solicitud
        Object.keys(updates).forEach((update) => {
            user[update] = updates[update];
        });

        // Guarda el usuario actualizado en la base de datos
        const updatedUser = await user.save();

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    loginUser,
    updateCalificationUser,
    updateUserProfilePic,
};

