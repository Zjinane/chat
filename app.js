const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const ent = require('ent');
let ssn ;

app.use(cookieParser());

app.use(session({secret:'secret', 'resave': false ,'saveUninitialized': true }));// utilise la session 

app.use(express.static('client')); //use CSS 



app.get('/',(req, res) => {
	ssn = req.session;// require la session dans la variable ssn
	if(ssn.pseudo){ // active la session avec le pseudo et redirige vers index.html
		res.sendFile(__dirname + '/index.html');
	}
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
