var path = require('path');
var express = require('express');
var app = express();
var server = require('http').Server(app);
app.use(express.static(path.join(__dirname, 'public')));
server.listen(8080);


// Using the filesystem module


var io = require('socket.io')(server);



// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.on('connection',
  // We are given a websocket object in our function
  function (socket) {
    
    socket.emit('id', socket.id);
  
    console.log("We have a new client: " + socket.id);
    
    socket.on('jump',
      function(data) {
        // Data comes in as whatever was sent, including objects
        console.log("Received: 'jump' " + data.jump);
      
        // Send it to all other clients
        socket.broadcast.emit('jump', data);
        
        // This is a way to send to everyone including sender
        // io.sockets.emit('message', "this goes to everyone");

      }
    );

    socket.on('joined', function(data)
    {
        console.log("Player "+data.sID+" is requesting avatar creation: "+data.newAvatar);
        socket.broadcast.emit('joined',data);
      }
    );
    // When this user emits, client side: socket.emit('otherevent',some data);
    socket.on('mouse',
      function(data) {
        // Data comes in as whatever was sent, including objects
        console.log("Received: 'mouse' " + data.x + " " + data.y);
      
        // Send it to all other clients
        socket.broadcast.emit('mouse', data);
        
        // This is a way to send to everyone including sender
        // io.sockets.emit('message', "this goes to everyone");

      }
    );
    
    socket.on('disconnect', function() {
      console.log("Client has disconnected");
      socket.broadcast.emit('left', socket.id)
    });

    socket.on('incScore', function(data){
      socket.broadcast.emit('incScore',data);
    });

    socket.on('playerData', function(data){
      socket.broadcast.emit('playerData', data);
    });
  }
);