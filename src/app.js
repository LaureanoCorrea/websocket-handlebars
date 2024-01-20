const express = require("express");
const http = require("http");
const handlebars = require("express-handlebars");
const { Server } = require("socket.io");
const ProductManager = require("./Managers/productManager");
const CartManager = require("./Managers/cartsManager");

const productService = new ProductManager();
console.log('product sevice creado ',productService);

const app = express();
const PORT = 8080;
const httpServer = app.listen(PORT, () => console.log(`Escuchando el puerto ${PORT}`));
const socketServer = new Server(httpServer); 


const homeRouter = require("./Routes/home.router.js")(productService);
const realTimeProductsRouter = require("./Routes/realtimeproducts.router.js")(socketServer);
const productRouter = require("./Routes/products.router.js")(socketServer);
const cartRouter = require("./Routes/carts.router.js")(productService);

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use("/", homeRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/realtimeproducts", realTimeProductsRouter);

socketServer.on('connection', socket => {
    console.log("Se conectó un cliente");
});
