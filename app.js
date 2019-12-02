// gets modules from node
const http = require('http');
const fs = require('fs');

//connexion server
const server = http.createServer((req,res) => {
	fs.readFile('./index.html', 'utf-8', (error, content) => {
		res.writeHead(200,{"Content-Type": "text/html"});
		res.end(content);
	});
});
// require module socket + connect server
const io = require('socket.io').listen(server);
//when client connect in socket, console log in server
io.sockets.on('connection', (socket) => {
	socket.emit('message', 'Chaussette, Vous etes bien connecté !');
	//broadcast so all clients connected receive the following message
	socket.broadcast.emit('message', 'Message to every sock, another sock is connected');
	//new pseudo stocks in session variable pseudo defined in index.html
	socket.on('newSockConnecting', (pseudo) => {
    socket.pseudo = pseudo;
	});
	//to get messages from the client side
	socket.on('message', (message) => {
	console.log(socket.pseudo + ' is talking to me. It says to me: ' + message);
	});
});

// always at the end (server listens on 9876)
server.listen(9876);
