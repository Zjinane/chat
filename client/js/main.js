
 // Connexion à socket.io
 const socket = io.connect('http://localhost:9876');

 // On demande le pseudo, on l'envoie au serveur et on l'affiche dans le titre
 let pseudo = prompt('Quel est votre pseudo ?', 'Sock');
if (!pseudo){
	pseudo = 'Sock';
}
socket.emit('nouveau_client', pseudo);
 document.title = pseudo + ' - ' + document.title;

 // Quand on reçoit un message, on l'insère dans la page
 socket.on('message', (data) => {
	 insertMessage(data.pseudo, data.message)
	console.log(data);
})

 // Quand un nouveau client se connecte, on affiche l'information
 socket.on('nouveau_client', (pseudo) => {
     $('#zone_chat').prepend('<p><em> Hey la chaussette ' + pseudo + ' a rejoint le Chat !</em></p>');
 })

// Lorsqu'on envoie le formulaire, on transmet le message et on l'affiche sur la page
 $('#formulaire_chat').submit(() => {
     const message = $('#msg').val();
     socket.emit('message', message); // Transmet le message aux autres
     insertMessage(pseudo, message); // Affiche le message aussi sur notre page
     $('#msg').val('').focus(); // Vide la zone de Chat et remet le focus dessus
     return false; // Permet de bloquer l'envoi "classique" du formulaire
	 });

// Ajoute un message dans la page
 function insertMessage(pseudo, message) {
                $('#zone_chat').prepend('<div class="chat__card"><div class="chat__avatar">' + pseudo + '</div><div class="chat__message"> ' + message + '</div></div>');
            }
