document.addEventListener("DOMContentLoaded", () => {
  const socket = io();
  
  function setupSocket() {
    socket.on("updateProductsList", (updatedProducts) => {
      console.log(updatedProducts);
      const productList = document.getElementById("productList");
      productList.innerHTML = "";

      updatedProducts.forEach((product) => {
        const listItem = document.createElement("li");
        listItem.textContent = product.title;
        productList.appendChild(listItem);
      });
    });
  }

  // Actualizar los datos despues de usar los formularios
  document
    .getElementById("createProductForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Object.fromEntries(formData)),
      });

      const result = await response.json();
      console.log(result);


      // Actualizar la lista de productos después de crear uno nuevo
      socket.emit("updateProductsList");
    });

  document
    .getElementById("deleteProductForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(event.target);
      const productId = formData.get("productId");

      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      const result = await response.json();
      console.log(result);

      // Actualizar la lista de productos después de eliminar uno
      socket.emit("updateProductsList");
    });

  setupSocket();
});
