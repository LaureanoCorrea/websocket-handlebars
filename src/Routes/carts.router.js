const express = require("express");
const CartManager = require("../Managers/cartsManager");

module.exports = (socketServer) => {
  const router = express.Router();
  const cartService = new CartManager();

  
  router
    .get("/:cid", async (req, res) => {
      try {
        const { cid } = req.params;
        const cart = await cartService.getCartById(parseInt(cid));
        res.send({
          status: "succes",
          payload: cart,
        });
      } catch (error) {
        console.log(error);
      }
    })
    .post("/", async (req, res) => {
      try {
        const result = await cartService.createCart();

        res.send({
          status: "succes",
          payload: result,
        });
      } catch (error) {
        res.status(500).send("Error del server, ${error.message}");
      }
    })
    .post("/:cid/products/:pid", async (req, res) => {
      try {
        const { cid, pid } = req.params;
        const result = await cartService.addProduct(Number(cid), Number(pid));
        res.send({
          status: "success",
          message: "Producto agregado al carrito",
          data: {
            cart: result.cart,
            addedProduct: result.addedProduct, 
          },
        });
      } catch (error) {
        es.status(500).json({ error: "Error al agregar al carrito" });
        console.log(error);
      }
    });

  return router;
};
