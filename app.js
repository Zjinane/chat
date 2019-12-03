// gets modules from node
const express = require('express');
const app = express();
// connect and create server
const server = require('http').createServer(app);
const fs = require('fs');
const sessionSockets = require('session.socket.io');
//connexion server
//const server = http.createServer((req,res) => {
//	fs.readFile('./index.html', 'utf-8', (error, content) => {
//		res.writeHead(200,{"Content-Type": "text/html"});
//		res.end(content);
//	});
//});
// require module socket + connect server
const io = require('socket.io').listen(server);
const ent = require('ent');

// load index page

app.get('/',(req, res)=>{
	res.sendfile(__dirname + '/index.html');
});

//when client connect in socket, console log in server
io.sockets.on('connection', (socket, pseudo) => {
	socket.emit('message', ' Hey Sock, you are connected !');
//new pseudo stocks in session variable pseudo defined in index.html
	socket.on('newSockConnecting', (pseudo) => {
		// blocks html carachtere
		pseudo = ent.encode(pseudo);
		socket.pseudo = pseudo;
		//broadcast so all clients connected receive the following message
		socket.broadcast.emit('message', 'Message to every sock, '+ socket.pseudo + ' sock is connected');
	});
	//to get messages from the client side
	socket.on('message', (message) => {
		message = ent.encode(message);
	    socket.broadcast.emit('message',{pseudo: socket.pseudo, message: message});

	});
});

// always at the end (server listens on 9876)
server.listen(9876);
