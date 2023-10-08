const Service = require("../models/service");

// POST: Crear un nuevo servicio.
createService = async (req, res) => {
    console.log("POST: createService URL: /api/services");
    const service = new Service({
        ...req.body,
    });

    try {
        const savedService = await service.save();
        res.status(201).json(savedService);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// // GET: Obtener todos los servicios.
getAllServices = async (req, res) => {
    try {
        const services = await Service.find();
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET: Obtener servicios por categoría.
getServicesByCategory = async (req, res) => {
    const categoria = req.query.categoria;
    if (!categoria) {
        return res.status(400).json({ message: "La categoría es requerida." });
    }

    try {
        const services = await Service.find({ categoria: categoria });
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET: Obtener los últimos servicios publicados.
getLastServices = async (req, res) => {
    const limit = 5; // Número de servicios a devolver por solicitud
    const skip = Number(req.query.skip) || 0; // Número de servicios a omitir (para paginación)

    try {
        const services = await Service.find()
            .select('id nombreServicio fechaCreacion descripcion imagen categoria fechaSolicitud idCreador') // Selecciona solo los campos necesarios
            .sort({ fechaCreacion: -1 }) // Ordena de menor a mayor fecha de creación
            .skip(skip)
            .limit(limit);
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

getServicesByUser = async (req, res) => {
    try {
        const services = await Service.find({ idCreador: req.query.idCreador });
        res.json(services);
    }catch (error) {
        res.status(500).json({ message: error.message });
    }
}
getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        res.json(service);
        console.log('Servicio buscado',service)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

updateServiceStatus = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body; // Cambiar 'estado' a 'status'

    try {
        // Validación de datos (puedes agregar más validaciones según tus necesidades)
        if (typeof estado !== 'number') {
            return res.status(400).json({ message: "El estado debe ser un número válido." });
        }

        const service = await Service.updateOne({ _id: id }, { $set: { estado } });

        if (!service) {
            return res.status(404).json({ message: "Servicio no encontrado." });
        }

        // Puedes devolver una respuesta 200 OK o el objeto actualizado según tus necesidades.
        res.status(200).json(service);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


module.exports = {
    createService,
    getAllServices,
    getServicesByCategory,
    getLastServices,
    getServicesByUser,
    getServiceById,
    updateServiceStatus,
};