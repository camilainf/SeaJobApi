const Category = require('../models/category');
const Service = require("../models/service");

// // GET: Leer todos las categorías
getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST: Crear una nueva categoría
createCategory = async (req, res) => {
    const category = new Category({
        ...req.body,
    });

    try {
        const savedCategory = await category.save();
        res.status(201).json(savedCategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// GET: Obtener las 4 categorías más populares.
// Se define una categoría como popular dependiendo de cuantos servicios son definidos por esta.
getPopularCategories = async (req, res) => {
    try {
        // Agrupar los servicios por categoría y contar cuántos hay en cada una
        const mostPopularCategories = await Service.aggregate([
            {
                $group: {
                    _id: "$categoria", // Agrupar por el campo 'categoria'
                    count: { $sum: 1 } // Sumar 1 por cada servicio en la categoría
                }
            },
            {
                $sort: { count: -1 } // Ordenar de forma descendente por la cantidad de servicios
            },
            {
                $limit: 4 // Limitar a las 4 categorías más populares
            }
        ]);

        // Ahora, vamos a buscar los detalles de estas categorías en la colección Category
        let categoryDetails = await Category.find({
            nombre: { $in: mostPopularCategories.map(cat => cat._id) }
        });

        // Mapear el orden correcto basado en mostPopularCategories
        categoryDetails = mostPopularCategories.map(popularCategory => {
            const detail = categoryDetails.find(detail => detail.nombre === popularCategory._id);
            return {
                ...detail._doc,
                count: popularCategory.count
            };
        });

        res.json(categoryDetails);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    getAllCategories,
    createCategory,
    getPopularCategories
};