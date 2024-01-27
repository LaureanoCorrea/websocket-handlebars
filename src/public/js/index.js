const socket = io(); //lado cliente

socket.emit("message", "hola desde el cliente");
socket.on("para-todos", data => {
    console.log(data);
})

