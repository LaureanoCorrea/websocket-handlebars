const express = require("express");
const homeRouter = require("./Routes/home.router");
const realTimeProductsRouter = require("./Routes/realtimeproducts.router");
const productRouter = require("./Routes/products.router");
const cartRouter = require("./Routes/carts.router");
const handlebars = require("express-handlebars");
const { Server: ServerIO } = require("socket.io");

const app = express();
const PORT = 8080;
const httpServer = app.listen(PORT, () => console.log(`Escuchando el puerto ${PORT}`));
const socketServer = new ServerIO (httpServer); // lado servidor

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use("/", homeRouter);
app.use("/realtimeproducts", realTimeProductsRouter(socketServer));
app.use("/api/products", productRouter(socketServer));
app.use("/api/carts", cartRouter);



socketServer.on('connection', socket => {
    console.log("Se conecto un cliente");
    socket.emit("message", "hola desde el servidor");
    socket.on('message', data => {
        console.log(data);
    })
    socket.on('message-todos-menos-actual', data => {
        console.log(data);
    })
    socket.broadcast.emit('message-todos-menos-actual', "solo para ellos"); //lo reciebn todos menos el que lo mando 
    socketServer.emit("para-todos", "mensaje para todos" )
});
