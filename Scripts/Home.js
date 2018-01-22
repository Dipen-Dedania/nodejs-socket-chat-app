var socket = io();
var user = "BOT";

userEventListener = function(){
  socket.on('chat message', function(messageObj){

    var flRight = "";
    if(user == messageObj.user) {
      flRight = "activeUserMsg";
    }
    var obj ='<li class="messageContainer">';
    obj +='<div class="userLogoStyle btn-material-deep-purple shadow-z-2 '+ flRight+ '">';
    obj += messageObj.user.charAt(0);
    obj +='</div>';
    obj +='<div class="userMessageStyle shadow-z-2 '+ flRight+ '">';
    if(user != messageObj.user) {
      obj +='<div class="arrow-left"></div>';
    } else {
      obj +='<div class="arrow-right"></div>';
    }
    obj +='<div>'+messageObj.msg+'</div>';
    obj +='</div>';
    obj +='</li>';
    $('#messages').append(obj);
    audioElement.play();
    $("html, body").animate({ scrollTop: ($(document).height() +56 + $('#stickers').height()) }, 1000);
  });

  socket.on('new user', function(users){
    var obj = "";
    $.each(users, function(index, value){
        obj += '<li id="u' + value.name + '"  class="userContainer">';
        obj += '<div class="userLogoStyle btn-material-deep-purple shadow-z-2">';
        obj += value.name.charAt(0);
        obj += '</div>';
        obj += '<div class="userNameStyle">';
        obj += value.name;
        obj += '</div>';
        obj += '</li>';
    });

    $('#users').html(obj);
  });

  socket.on('remove user', function(user){
    removeUser(user);
  });

  socket.on('typing', function(user){
    showTyping(user);
  });

  socket.on('stopTyping', function(user){
    hideTyping(user);
  });

  socket.on('sticker', function(messageObj){
    sendSticker(messageObj);
  });
};

showTyping = function(user){
    $('#typingContainer').text(user + " is typing..");
    $('#typingContainer').show();
};

hideTyping = function(user){
    $('#typingContainer').hide();
};

removeUser = function(user){
    $('#u' + user).remove();
};

sendSticker = function(messageObj){
    var flRight = "";
    if(user == messageObj.user) {
      flRight = "activeUserMsg";
    }
    var obj ='<li class="messageContainer">';
    obj +='<div class="userLogoStyle btn-material-deep-purple shadow-z-2 '+ flRight+ '">';
    obj += messageObj.user.charAt(0);
    obj +='</div>';
    obj +='<div class="userMessageStyle shadow-z-2 '+ flRight+ '">';
    if(user != messageObj.user) {
      obj +='<div class="arrow-left"></div>';
    } else {
      obj +='<div class="arrow-right"></div>';
    }
    obj +='<div>';
    obj +='<img src="'+messageObj.emoji+'" class="emoji" />';
    obj +='</div>';
    obj +='</div>';
    obj +='</li>';
    $('#messages').append(obj);

    audioElement.play();
    $('#stickers').removeClass('stickersContainerShown');
    $("html, body").animate({ scrollTop: ($(document).height() +56+ $('#stickers').height()) }, 1000);
};


createStickersContainer = function(){
    var imgObj = "";
    for(var i=1; i<190; i++){
        imgObj +="<img src='/Stickers/EmojiSmiley/Emoji Smiley-"+i+".png' class='sticker' />";
    }
    $('#stickers').html(imgObj);
};

$(document).ready(function(){
  $.material.init();
  createStickersContainer();

  audioElement = document.createElement('audio');
  audioElement.setAttribute('src', 'audio.mp3');
  //audioElement.setAttribute('autoplay', 'autoplay');

  //user = "Dipen";
  user = window.prompt("Please enter your name.","");
  if(user == null){
    user = "BOT";
  }
  var userObj ={
      "name": user,
      "logoColor": "btn-material-blue"
  };
  socket.emit('new user', userObj);

  $('#sendBtn').click(function(){
    var messageObj = {
      user : user,
      msg : $('#messageBox').val()
    };
    socket.emit('chat message', messageObj);
    $('#messageBox').val('');
    return false;
  });

  $('.sticker').click(function(){
    var stickerName = $(this).attr('src');
    var messageObj = {
      user : user,
      emoji : stickerName
    };
    socket.emit('sticker', messageObj);
  });

  $('.stickerButton').click(function(){
      $('#stickers').toggleClass('stickersContainerShown');
  });

  userEventListener();

  $(window).bind('beforeunload', function() {
    socket.emit('remove user', user);
  });

  $('#messageBox').on('keydown',function(event){
	  if(event.keyCode == 13){
		    $('#sendBtn').trigger('click');
	  }else{
		    socket.emit('typing', user);
	  }
  });

  $('#messageBox').on('blur',function(){
    setTimeout(function(){
      socket.emit('stopTyping', user);
    },500);

  });

  $('.tabStyle').click(function(){
    $('.tabStyle').removeClass('activeTab');
    $(this).addClass('activeTab');
    if($(this).text() == "My Chats"){
      $('#messageContainer').show();
      $('#usersContainer').hide();
    }else{
      $('#messageContainer').hide();
      $('#usersContainer').show();
    }
  });
});
