const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const ent = require('ent');

// A TRAVAILLER


//app.use(cookieParser());

app.use(session({secret:'secret', 'resave': false ,'saveUninitialized': true }));// utilise la session 

app.use(express.static('client')); //use CSS 

// set what happens when on root
app.get('/',(req, res) => {	
	res.sendFile(__dirname + '/index.html');
		io.socket.on('connection', (socket, pseudo) => {
			socket.on('nouveau_client', (pseudo) => {
				pseudo = ent.encode(pseudo);
				socket.pseudo = pseudo;
				req.session.pseudo;
				console.log(req.session.pseudo);
				});
			});
		});

// A TRAVAILLER

// faire connexion a socket
io.sockets.on('connection',(socket, pseudo) => {
    socket.on('nouveau_client',(pseudo) => {//cree nouveau pseudo
		pseudo = ent.encode(pseudo);
        socket.pseudo = pseudo;
		socket.broadcast.emit('nouveau_client', pseudo); //envoie aux autre clients
    });

    socket.on('message',(message) => {
        message = ent.encode(message);
		console.log(message);
        socket.broadcast.emit('message', {pseudo: socket.pseudo, message: message});
    }); 



});

server.listen(9876);
