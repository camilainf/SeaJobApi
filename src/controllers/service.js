const Service = require("../models/service");
const Offer = require("../models/offer");
const Valoration = require("../models/valoration");
const User = require("../models/user");

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
        const services = await Service.find({ isOwnerActive: true });
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
        const services = await Service.find({ categoria: categoria, isOwnerActive: true });
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

    // Define el objeto de consulta. Si se proporciona una categoría, incluirla en el filtro. Además no incluir los servicios de usuarios inactivos
    const query = categoria ? { categoria, isOwnerActive: true } : { isOwnerActive: true };

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
        const services = await Service.find({ idCreador: req.query.idCreador, isOwnerActive: true });
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

getServiceById = async (req, res) => {
    try {
        const service = await Service.findOne({ _id: req.params.id, isOwnerActive: true });
        if (!service) {
            return res.status(404).json({ message: "Servicio no encontrado o inactivo." });
        }
        res.json(service);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

getServicesAcceptedByUser = async (req, res) => {
    try {
        const userId = req.params.id;

        // Buscar todas las ofertas aceptadas por ese usuario
        const acceptedOffers = await Offer.find({ idCreadorOferta: userId, estaEscogida: true });

        // Obtener solo los IDs de los servicios de esas ofertas
        const serviceIds = acceptedOffers.map(offer => offer.idServicio);

        // Buscar los servicios que corresponden a esos IDs
        const services = await Service.find({ '_id': { $in: serviceIds }, 'isOwnerActive': true });

        // Enviar esos servicios como respuesta
        res.json(services);

    } catch (error) {
        res.status(500).json({ message: "Error al obtener los servicios.", error: error.message });
    }
}

// GET: Obtener servicios en los que el usuario ha ofertado y que no han sido tomados
getServicesOfferedByUser = async (req, res) => {
    try {
        const userId = req.params.id;

        // Buscar todas las ofertas realizadas por ese usuario
        const userOffers = await Offer.find({ idCreadorOferta: userId });

        // Obtener solo los IDs de los servicios de esas ofertas
        const serviceIds = userOffers.map(offer => offer.idServicio);

        // Buscar los servicios que corresponden a esos IDs y que están en estado 1
        const services = await Service.find({ 
            '_id': { $in: serviceIds }, 
            'isOwnerActive': true,
            'estado': 1
        });

        res.json(services);

    } catch (error) {
        res.status(500).json({ message: "Error al obtener los servicios.", error: error.message });
    }
}

updateServiceStatus = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body; // Cambiar 'estado' a 'status'

    try {
        const service = await Service.findOne({ _id: id, isOwnerActive: true });
        if (!service) {
            return res.status(404).json({ message: "Servicio no encontrado o inactivo." });
        }

        if (typeof estado !== 'number') {
            return res.status(400).json({ message: "El estado debe ser un número válido." });
        }

        if (estado === 4) {

            console.log("ENTRÓ AL ESTADO 4 AQUI");

            const creadorServicio = await User.findOne({_id: service.idCreador});
            console.log("creadorServicio",creadorServicio);

            const offer = await Offer.findOne({ idServicio: service._id, estaEscogida: true });
            console.log("offer",offer);

            const creadorOferta = await User.findOne({ _id: offer.idCreadorOferta });
            console.log("creadorOferta",creadorOferta);

            if ( !creadorServicio.isActive || !creadorOferta.isActive ) {
                console.log("Alguno de los usuarios creador/ofertador se encuentra inactivo, por lo que se omitirá el proceso de valoración.")
                estado = 5;
            }
        }

        service.estado = estado;
        await service.save();

        res.status(200).json(service);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

incrementClickCount = async (req, res) => {
    const { id } = req.params;

    try {
        const service = await Service.findOne({ _id: id, isOwnerActive: true });
        if (!service) {
            return res.status(404).json({ message: "Servicio no encontrado o inactivo." });
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
            lastClickDate: { $gte: oneWeekAgo },
            isOwnerActive: true
        })
            .sort({ clickCount: -1 })
            .limit(5);

        res.json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT: Actualizar un servicio
updateService = async (req, res) => {
    const { id } = req.params;
    const updates = req.body; // Campos que vienen en la solicitud para ser actualizados.

    try {
        const service = await Service.findOne({ _id: id, isOwnerActive: true });
        if (!service) {
            return res.status(404).json({ message: 'Servicio no encontrado o inactivo.' });
        }

        Object.keys(updates).forEach((update) => {
            if (update !== 'idCreador') {
                service[update] = updates[update];
            }
        });

        await service.save(); // Se guarda el documento modificado

        res.status(200).json(service);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE: Eliminar un servicio y todos los registros asociados.
deleteService = async (req, res) => {
    const { id } = req.params; // El ID del servicio a eliminar.

    try {
        const service = await Service.findOneAndDelete({ _id: id, isOwnerActive: true });
        if (!service) {
            return res.status(404).json({ message: 'Servicio no encontrado o inactivo.' });
        }

        await Offer.deleteMany({ idServicio: id });
        await Valoration.deleteMany({ idServicio: id });

        res.status(200).json({ message: 'Servicio eliminado con éxito.' });
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
    updateService,
    deleteService,
    getServicesOfferedByUser
};