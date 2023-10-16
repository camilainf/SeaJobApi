const Valoration = require("../models/valoration");

createValoration = async (req, res) => {
  console.log("POST: createValoration URL: /api/valoration");
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
getValorationById = async (req, res) => {
  try {
    const valoration = await Valoration.findById(req.params.id);
    res.json(valoration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  createValoration,
};
