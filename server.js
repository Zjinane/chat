const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const ent = require('ent');

//appel module
const MongoClient = require('mongodb').MongoClient;
//url bdd
const uri = "mongodb+srv://root:rootroot@nodejs-nv5dk.mongodb.net/test?retryWrites=true&w=majority";
//accept connexion bdd every client
const client = new MongoClient(uri, { useNewUrlParser: true });



app.use(express.static('client')); //use CSS 

// set what happens when on root
app.get('/',(req, res) => {
	res.sendFile(__dirname + '/index.html');
		});



// bdd = test/ collection = acces all bdd
client.connect(err => {
	const db = client.db("test").collection("chats");

console.log(' okkkkkk conected in db ');

// faire connexion a socket
io.sockets.on('connection',(socket, pseudo) => {
	db.find().limit(100).sort({_id:1}).toArray(// get data from db
	(err, res) =>{
		if(err){
			throw err;
		
		}
		socket.emit('output',res);
	});


	socket.on('nouveau_client',(pseudo) => {//cree nouveau pseudo
		pseudo = ent.encode(pseudo);
        socket.pseudo = pseudo;
		socket.broadcast.emit('nouveau_client', pseudo)
		//envoie aux autre clients
		
	});



    socket.on('message',(message) => {
        message = ent.encode(message);
		console.log(message);
        socket.broadcast.emit('message', {pseudo: socket.pseudo, message: message});
	}); 

//insert in database
db.insert({ pseudo: 'nouveau_client', message: 'message'});


// perform actions on the collection object
  client.close();
});

});


server.listen(9876);
