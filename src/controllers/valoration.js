const Valoration = require("../models/valoration");


createValoration = async (req, res) => {
  const valoration = new Valoration({
    ...req.body,
  });
  try {
    const savedValoration = await valoration.save();
    res.status(201).json(savedValoration);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
getValorationByIdService = async (req, res) => {
  try {
    const valoration = await Valoration.findOne({ idServicio:req.params.id});
    res.json(valoration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

updateValoration = async (req, res) => {
  const { idValoracion, dueñoValoro, trabajadorValoro } = req.body;
  try {
    const valoration = await Valoration.findById(idValoracion);
    if (!valoration) {
      return res.status(404).json({ message: 'Valoración no encontrada' });
    }
    if (dueñoValoro !== null && dueñoValoro !== undefined) {
      valoration.dueñoValoro = dueñoValoro;
    }
    if (trabajadorValoro !== null && trabajadorValoro !== undefined) {
      valoration.trabajadorValoro = trabajadorValoro;
    }
    const updatedValoration = await valoration.save();
    res.json(updatedValoration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createValoration,
  getValorationByIdService,
  updateValoration  // Exporta la nueva función
};
