const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const ent = require('ent');

app.get('/',(req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection',(socket, pseudo) => {
    socket.on('nouveau_client',(pseudo) => {
        pseudo = ent.encode(pseudo);
        socket.pseudo = pseudo;
        socket.broadcast.emit('nouveau_client', pseudo);
    });

    socket.on('message',(message) => {
        message = ent.encode(message);
        socket.broadcast.emit('message', {pseudo: socket.pseudo, message: message});
    }); 
});

server.listen(9876);
