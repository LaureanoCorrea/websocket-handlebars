const fs = require("fs").promises;
const CartManager = require("./cartsManager");

class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
  }

  
    async saveProducts() {
      try {
        const data = JSON.stringify(this.products, null, 2);
        await fs.writeFile(this.path, data, 'utf-8');
      } catch (error) {
        console.error('Error al guardar productos:', error);
      }
    }
  
    validateProduct(product) {
      if (
        !product.title ||
        !product.description ||
        !product.price ||
        !product.thumbnails ||
        !product.code ||
        !product.stock
      ) {
        return "Todos los campos son obligatorios";
      }
      return null;
    }
  
    async addProduct(product) {
      try {
        await this.loadProducts();
        const productValidation = this.validateProduct(product);
        if (productValidation) {
          return { status: "error", message: productValidation };
        }
      } catch (error) {
        console.error(error);
        return "Error al agregar el producto";
        
      }
  
      const noRepeatCode = this.products.find(
        (prod) => prod.code === product.code
      );
      if (noRepeatCode) {
        return {
          status: "error",
          message: "Ya existe un producto con ese código",
      };
    }
      const newProduct = {
        ...product,
        id: this.generateProductId(),
      };
      this.products.push(newProduct);
  
      await this.saveProducts();
      return {
        status: "success",
        message: "Producto agregado correctamente",
        product: newProduct,
      };
    }
  
    generateProductId() {
      return (
        (Math.max(
          ...(this.products ? this.products.map(prod => prod.id) : [0]),
          0
        ) + 1
      ));
    }
  
    async loadProducts() {
      try {
        const data = await fs.readFile(this.path, "utf-8");
        this.products = JSON.parse(data);
      } catch (error) {
        if (error.code === "ENOENT") {
          await this.saveProducts();
        } else {
          console.error("Error al cargar productos:", error);
          this.products = [];
          throw error;
        }
      }
    }

    getProducts(limit) {
      if (limit) {
        return this.products.slice(0, limit);
      }
      return this.products;
    }
  
    getProductById(id) {
      if (!this.products) {
        return "No hay productos";
      }
      const product = this.products.find(prod => prod.id === id);
      if (!product) {
        return "Producto no encontrado";
      }
      return product;
    }
  
    async updateProduct(id, updatedFields) {
      const index = this.products.findIndex((prod) => prod.id === id);
      if (index === -1) {
        return "Producto no encontrado";
      }
  
      this.products[index] = {
        ...this.products[index],
        ...updatedFields,
      };
  
      await this.saveProducts();
      return "Producto actualizado correctamente";
    }
  
    async deleteProduct(id) {
      const index = this.products.findIndex((prod) => prod.id === id);
      if (index === -1) {
        return "Producto no encontrado";
      }
  
      this.products.splice(index, 1);
  
      await this.saveProducts();
      return "Producto eliminado correctamente";
    }
  }
  
  (async () => {
    const products = new ProductManager("./jsonDB/products.json");
  })();
  
  module.exports = ProductManager;