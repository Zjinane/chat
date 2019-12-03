const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const ent = require('ent');

app.use(express.static('client')); //use CSS 

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
		console.log(message);
        socket.broadcast.emit('message', {pseudo: socket.pseudo, message: message});
    }); 
});

server.listen(9876);
