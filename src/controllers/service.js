const Service = require("../models/service");
const Offer = require("../models/offer");

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

// GET: Obtener los últimos servicios publicados y filtrarlos por categoría siesque viene en la query de la url.
getLastServices = async (req, res) => {
    const limit = 5; // Número de servicios a devolver por solicitud
    const skip = Number(req.query.skip) || 0; // Número de servicios a omitir (para paginación)
    const categoria = req.query.categoria; // Recupera la categoría de la consulta

    // Define el objeto de consulta. Si se proporciona una categoría, incluirla en el filtro.
    const query = categoria ? { categoria } : {};

    try {
        const services = await Service.find(query)
            .select('id nombreServicio fechaCreacion descripcion imagen categoria fechaSolicitud idCreador direccion') // Selecciona solo los campos necesarios
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
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        res.json(service);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getServicesAcceptedByUser = async (req, res) => {
    try {
        const userId = req.params.id; // Asumo que pasas el ID del usuario como parámetro en la URL

        // Buscar todas las ofertas aceptadas por ese usuario
        const acceptedOffers = await Offer.find({ idCreadorOferta: userId, estaEscogida: true });

        // Obtener solo los IDs de los servicios de esas ofertas
        const serviceIds = acceptedOffers.map(offer => offer.idServicio);

        // Buscar los servicios que corresponden a esos IDs
        const services = await Service.find({ '_id': { $in: serviceIds } });

        // Enviar esos servicios como respuesta
        res.json(services);

    } catch (error) {
        res.status(500).json({ message: "Error al obtener los servicios.", error: error.message });
    }
}

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

incrementClickCount = async (req, res) => {
    const { id } = req.params;

    try {
        const service = await Service.findById(id);
        if (!service) {
            return res.status(404).json({ message: "Servicio no encontrado." });
        }

        service.clickCount += 1;
        service.lastClickDate = new Date();
        await service.save();

        res.status(200).json(service);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

getFeaturedServicesOfWeek = async (req, res) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    try {
        const services = await Service.find({
            lastClickDate: { $gte: oneWeekAgo }
        })
            .sort({ clickCount: -1 })
            .limit(5);

        res.json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT: Actualizar un servicio
updateServiceById = async (req, res) => {
    const { id } = req.params;
    const updates = req.body; // Esto contendrá todos los campos enviados en la solicitud para actualizar

    try {
        // Encuentra al servicio por ID
        const service = await Service.findById(id);
        if (!service) {
            return res.status(404).json({ message: 'Servicio no encontrado' });
        }

        // Actualiza cada campo enviado en la solicitud
        Object.keys(updates).forEach((update) => {
            service[update] = updates[update];
        });

        // Guarda el servicio actualizado en la base de datos
        const updatedService = await service.save();

        res.status(200).json(updatedService);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createService,
    getAllServices,
    getServicesByCategory,
    getLastServices,
    getServicesByUser,
    getServiceById,
    updateServiceStatus,
    incrementClickCount,
    getFeaturedServicesOfWeek,
    getServicesAcceptedByUser,
    updateServiceById
};