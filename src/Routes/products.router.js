const express = require("express");
const router = express.Router();
const ProductManager = require("../Managers/productManager");

module.exports = (socketServer) => {
  const productService = new ProductManager();

  router
    .get("/", async (req, res) => {
      try {
        const limit = req.query.limit;
        const products = await productService.getProducts(limit);
        res.json(products);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener productos" });
      }
    })
    .get("/:pid", async (req, res) => {
      try {
        const { pid } = req.params;
        const product = await productService.getProductById(parseInt(pid));
        if (product === "Producto no encontrado") {
          res.status(404).json({ error: product });
        } else {
          res.json(product);
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener el producto" });
      }
    })
    .post("/", async (req, res) => {
      try {
        const result = await productService.addProduct(req.body);
        if (typeof result === "string") {
          res.status(200).json({ message: result });
          socketServer.emit("updateProductsList", productService.getProducts());
        } else {
          res.status(400).json({ error: result });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al agregar el producto" });
      }
    })
    .put("/:pid", async (req, res) => {
      try {
        const { pid } = req.params;
        const updatedFields = req.body;
        const result = await productService.updateProduct(
          parseInt(pid),
          updatedFields
        );
        if (result.error) {
          res.status(404).json(result);
        } else {
          res.json(result);
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al actualizar el producto" });
      }
    })
    .delete("/:pid", async (req, res) => {
      try {
        const { pid } = req.params;
        const result = await productService.deleteProduct(parseInt(pid));
        if (typeof result === "string") {
          res.status(200).json({ message: result });
          socketServer.emit('updateProductsList', productService.getProducts());
        } else {
          res.status(400).json({ error: result });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al eliminar el producto" });
      }
    });

    return router;
};
