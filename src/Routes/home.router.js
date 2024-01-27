const express = require('express');
const router = express.Router();
const ProductManager = require("../Managers/productManager");

const productService = new ProductManager();

router.get('/', async (req, res) => {
    try {
        const products = await productService.getProducts();
        res.render('home', { products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

module.exports = router;
