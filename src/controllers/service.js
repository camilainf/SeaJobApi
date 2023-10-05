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

module.exports = {
    createService,
    getAllServices,
    getServicesByCategory
};