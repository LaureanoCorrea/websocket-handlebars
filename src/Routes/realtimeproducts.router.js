const express = require('express');
const router = express.Router();

module.exports = (socketServer, productService) => {
    console.log(productService)
    // Ruta para la conexión del WebSocket
    router.get('/', (req, res) => {
        socketServer.on('connection', (socket) => {
            console.log('Se conectó un cliente');
            socketServer.emit('updateProductsList', productService.getProducts());
        });
        res.send(realTimeProducts);
    });

    return router;
};
