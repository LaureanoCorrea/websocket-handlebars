const express = require('express');
const router = express.Router();
const ProductManager = require("../Managers/productManager");

module.exports = (socketServer) => {
    const productService = new ProductManager();

    // Ruta para obtener la lista de productos en tiempo real
    router.get("/", async (req, res) => {
        try {
            const limit = req.query.limit;
            const products = await productService.getProducts(limit);
            res.render('realTimeProducts', { products }); // Renderiza la vista con los productos
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al obtener productos" });
        }
    });

    router.post('/', async (req, res)=>{
        try {
            const { title, description, price, thumbnail, code, stock } = req.body;
    
            await productService.addProduct({ title, description, price, thumbnail, code, stock });
            socketServer.io?.emit('new-product', {title}); // Notificar al cliente que un nuevo producto ha sido agregado
    
            res.sendStatus(201); // Enviar respuesta de éxito
            socketServer.emit("updateProductsList",  productService.getProducts());

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al agregar el producto" });
        }
    });

    router.delete('/:productId', async (req, res) => {
        try {
            const { productId } = req.body;
            await productService.deleteProduct(productId);
            socketServer.io?.emit('new-product', {id}); // Notificar al cliente que un nuevo producto ha sido eliminado

            res.sendStatus(201); // Enviar respuesta de éxito
            socketServer.emit("updateProductsList",  productService.getProducts());

        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            res.status(500).json({ error: 'Error al eliminar el producto' });
        }
    });
    return router;
};