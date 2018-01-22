var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var express = require('express');
var $=require('jquery');

GLOBAL.Users = [];

app.use(express.static(__dirname));

app.get('/', function(req, res){
  res.sendFile('/index.html', {root: __dirname });
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
  socket.on('sticker', function(sticker){
    io.emit('sticker', sticker);
  });
  socket.on('new user', function(user){
    addUsers(user);
    io.emit('new user', GLOBAL.Users);
  });
  socket.on('remove user', function(user){
    removeUsers(user);
    io.emit('remove user', user);
  });
  socket.on('typing', function(user){
    io.emit('typing', user);
  });
  socket.on('stopTyping', function(user){
    io.emit('stopTyping', user);
  });
});

http.listen(3001, function(){
  console.log('listening on *:3001');
});

addUsers = function(user){
    var userObj ={
        "name": user.name,
        "logoColor": user.logoColor,
    };
    GLOBAL.Users.push(userObj);
};

removeUsers = function(user){
    for(var i=0; i < GLOBAL.Users.length; i++){
      if (GLOBAL.Users[i].name == user) {
        GLOBAL.Users.splice(i, 1);
      }
    }
};
