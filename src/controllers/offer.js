const Offer = require("../models/offer");
const Service = require("../models/service");

// // GET: Leer todos las categorías
getAllOffers = async (req, res) => {
  try {
    const offers = await Offer.find();
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST: Ofertar a un servicio
offerToService = async (req, res) => {
  const { idServicio, idCreadorOferta, montoOfertado } = req.body;

  // Verificar si el servicio existe
  const service = await Service.findById(idServicio);
  if (!service) {
    return res.status(404).json({ message: "El servicio no existe." });
  }

  // Crear una nueva oferta
  const newOffer = new Offer({
    idServicio,
    idCreadorOferta,
    montoOfertado,
    estaEscogida: false,
  });

  try {
    const savedOffer = await newOffer.save();
    res.status(201).json(savedOffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

getOfferOfService = async (req, res) => {
  const id = req.params.id;
  try {
    const offers = await Offer.find({ idServicio: id });
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
getOfferAceptedOfService = async (req, res) => {
  const { id } = req.params;
  try {
    const offers = await Offer.find({
      idServicio: id,
      estaEscogida: true,
    });
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
acceptAnOffer = async (req, res) => {
  const { id } = req.params;
  try {
    const offer = await Offer.findById(id);
    offer.estaEscogida = true;
    const savedOffer = await offer.save();
    res.status(201).json(savedOffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllOffers,
  offerToService,
  getOfferOfService,
  getOfferAceptedOfService,
  acceptAnOffer,
};
