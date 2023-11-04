const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Offer = require('../models/offer');
const Service = require('../models/service');

loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user.isActive) {
            return res.status(400).json({ message: 'Esta cuenta ha sido desactivada.' });
        }

        if (!user) {
            return res.status(400).json({ message: 'Usuario o contraseña incorrecta.' });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(400).json({ message: 'Usuario o contraseña incorrecta.' });
        }

        // Genera un JWT
        const token = jwt.sign(
            { id: user._id, email: user.email , isAdmin: user.isAdmin},
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

    // Verificar si el correo ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: 'El correo ya está en uso.' });
    }

    // Hashear la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear el objeto user con la contraseña hasheada
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
        const users = await User.find({ isActive: true });
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

updateCalificationUser = async (req, res) => {
    const id = req.params.id;
    const valoracion = req.body.calificacion;


    // Comnprobar si la calificación es nula o no está definida
    if (valoracion === null || valoracion === undefined) {
        return res.status(400).json({ message: 'La calificación no puede ser nula.' });
    }

    try {
        // Encontrar al usuario por su ID
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Añadir la nueva calificación al array de calificaciones
        user.calificacion.push(req.body.calificacion);

        // Calcular el promedio
        const avgCalificacion = user.calificacion.reduce((acc, curr) => acc + curr, 0) / user.calificacion.length;

        // Actualizar el documento en la base de datos con el nuevo array y el promedio
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

    // No se debe permitir que el usuario actualice directamente algunos campos sensibles como 'password'.
    if (updates.password) {
        return res.status(400).json({ message: 'No se permite la actualización directa de la contraseña.' });
    }

    try {
        // Encontrar al usuario por ID
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Verificar si el usuario está activo
        if (!(user.isActive)) {
            return res.status(400).json({ message: 'No se puede actualizar una cuenta desactivada.' });
        }

        // Actualizar cada campo enviado en la solicitud
        Object.keys(updates).forEach((update) => {
            user[update] = updates[update];
        });

        // Guardar el usuario actualizado en la base de datos
        const updatedUser = await user.save();

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

getMoneyEarnUser = async (req, res) => {
    const { id } = req.params;  // Id del usuario
    try {
        // Pipeline de agregación
        const pipeline = [
            // Filtrar ofertas donde el idCreadorOferta es el usuario y estaEscogida es true
            { $match: { idCreadorOferta: id, estaEscogida: true } },
            // Agrupar por null para obtener una suma total, ya que no estamos agrupando por ningún campo específico
            {
                $group: {
                    _id: null,
                    totalEarnings: { $sum: '$montoOfertado' }
                }
            }
        ];

        // Ejecutar la agregación
        const result = await Offer.aggregate(pipeline);

        // Verificar si se obtuvo un resultado
        if (result.length > 0) {
            const totalEarnings = result[0].totalEarnings;
            res.json({ totalEarnings });
        } else {
            res.json({ totalEarnings: 0 });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

deleteUser = async (req, res) => {
    console.log("deleteUser");
    const { id } = req.params;  // Id del usuario

    try {
        // Desactivar el usuario
        const user = await User.findByIdAndUpdate(id, { isActive: false }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Encontrar todas las ofertas aceptadas por el usuario para servicios con estado específico
        const affectedOffers = await Offer.find({
            idCreadorOferta: id,
            estaEscogida: true
        }).populate('idServicio');

        // Filtrar los servicios que están en un estado específico (mayor a 1 y menor a 4)
        const servicesToUpdateSinIniciar = affectedOffers.filter(offer => 
            offer.idServicio.estado > 1 && offer.idServicio.estado < 4
        ).map(offer => offer.idServicio._id);

        const servicesToUpdateIniciados = affectedOffers.filter(offer => 
            offer.idServicio.estado === 4
        ).map(offer => offer.idServicio._id);

        // Actualizar el estado de los servicios afectados que se encuentran en estado de Oferta a Inicio
        await Service.updateMany(
            { _id: { $in: servicesToUpdateSinIniciar } },
            { $set: { estado: 1 } }  // restablecer el estado a "En oferta"
        );

        // Actualizar el estado de los servicios afectados que se encuentran en estado de valoración
        await Service.updateMany(
            { _id: { $in: servicesToUpdateIniciados } },
            { $set: { estado: 6 } }  // Ya no se pueden valorar, entonces se dan como terminados.
        );

        // Desactivar los servicios que el usuario ha creado.
        await Service.updateMany(
            { idCreador: id },
            { $set: { isOwnerActive: false } }  // desactivar estos servicios
        );

        // Opcional: aquí ver si manejar la lógica para notificar a los usuarios afectados o realizar otras actualizaciones necesarias.

        res.json({ message: 'Usuario desactivado y servicios actualizados con éxito.' });
    } catch (error) {
        console.error(error);
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
    getMoneyEarnUser,
    deleteUser
};

