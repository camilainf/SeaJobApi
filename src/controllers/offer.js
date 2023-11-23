const Offer = require("../models/offer");
const Service = require("../models/service");
const User = require("../models/user");

// POST: Ofertar a un servicio
offerToService = async (req, res) => {
  console.log("offerToService")
  const { idServicio, idCreadorOferta, montoOfertado } = req.body;

  if (!idServicio || !idCreadorOferta || !montoOfertado) {
    return res.status(400).json({ message: "Campos requeridos faltantes." });
  }

  try {

    // Verificar si el usuario está activo
    const user = await User.findById(idCreadorOferta);
    if (!user || !user.isActive) {
      return res.status(403).json({ message: "Acción no permitida. El usuario se encuentra inactivo." });
    }

    const service = await Service.findById(idServicio);

    if (!service) {
      return res.status(404).json({ message: "El servicio no existe." });
    }

    const newOffer = new Offer({
      idServicio,
      idCreadorOferta,
      montoOfertado,
      estaEscogida: false,
    });

    const savedOffer = await newOffer.save();

    res.status(201).json(savedOffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

getOfferOfService = async (req, res) => {
  console.log("HOLA getOfferOfService")
  const id = req.params.id;
  try {
    // Obtener todas las ofertas.
    let offers = await Offer.find({ idServicio: id })
      .populate('idCreadorOferta');

    // Filtrar las ofertas.
    const filteredOffers = offers.filter(offer => offer.idCreadorOferta && offer.idCreadorOferta.isActive);

    // Modificar la respuesta para enviar solo los IDs de los creadores de las ofertas.
    const response = filteredOffers.map(offer => {
      return {
        _id: offer._id,
        idServicio: offer.idServicio,
        idCreadorOferta: offer.idCreadorOferta._id,
        montoOfertado: offer.montoOfertado,
        estaEscogida: offer.estaEscogida,
        __v: offer.__v
      };
    });

    // Enviar respuesta.
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

getOfferAceptedOfService = async (req, res) => {
  const { id } = req.params;
  try {
    const offer = await Offer.findOne({
      idServicio: id,
      estaEscogida: true,
    }).populate('idCreadorOferta');

    if (!offer) {
      return res.status(404).json({ message: "Oferta no encontrada" });
    }

    if (!offer.idCreadorOferta.isActive) {
      return res.status(404).json({ message: "La oferta fue realizada por un usuario inactivo." });
    }

    const simplifiedOffer = {
      _id: offer._id,
      idServicio: offer.idServicio,
      idCreadorOferta: offer.idCreadorOferta._id,
      montoOfertado: offer.montoOfertado,
      estaEscogida: offer.estaEscogida,
      __v: offer.__v
    };

    res.json(simplifiedOffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

acceptAnOffer = async (req, res) => {
  const { id } = req.params;

  try {
    
    const offer = await Offer.findById(id).populate('idCreadorOferta');
    if (!offer) {
      throw new Error("Oferta no encontrada.");
    }

    if (!offer.idCreadorOferta.isActive) {
      throw new Error("No se puede aceptar una oferta de un usuario inactivo.");
    }

    // 1. Marcar la oferta como "aceptada"
    offer.estaEscogida = true;
    await offer.save();

    // 2. Cambiar el estado del servicio relacionado con esa oferta
    const service = await Service.findById(offer.idServicio);
    if (!service || !service.isOwnerActive) {
      throw new Error("Servicio no encontrado o el propietario del servicio no está activo.");
    }

    service.estado = 2;

    // 3. Actualizar el monto del servicio con el monto ofertado
    service.monto = offer.montoOfertado;

    await service.save();

    res.status(201).json({ message: "Oferta aceptada y servicio actualizado correctamente." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  offerToService,
  getOfferOfService,
  getOfferAceptedOfService,
  acceptAnOffer,
};
