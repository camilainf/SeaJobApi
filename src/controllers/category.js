const Category = require('../models/category');

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
    console.log("POST: create URL: /api/categories");
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

module.exports = {
    getAllCategories,
    createCategory
};