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
	console.log('chaussette connectee');	
});

// always at the end (server listens on 9876)
server.listen(9876);
