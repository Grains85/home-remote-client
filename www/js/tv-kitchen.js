var socket = io();

socket.on('tv-kitchen-response', function(msg){
    //document.getElementById("calendar").innerHTML = msg;
    //setTimeout(reload, 60*60*1000);
});

function send(){
  socket.emit('tv-kitchen', 'power');
}

document.addEventListener('DOMContentLoaded', function() {

});
