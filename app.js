var port = 9800;
//var serverUrl = "127.0.0.1";

//var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
//var http = require("http");
var path = require("path");
var fs = require("fs");
//var url = require('url');
var checkMimeType = false;

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

const request = require('request');

/**
function setWeatherPage(content) {
  io.emit('weather', content);
}
*/

app.get('*', function(req, res){
  var request = req;
  var filename = req.url;
  //console.log("====================");
  //console.log(filename);
  if (filename == '/') {
      filename = "/index.html";
  }
  //if(filename.indexOf("evernote.js") > -1){
  //  initEvernote(req,res);
//    return;
//  }
  sendFile(filename, res);
});

http.listen(port, function(){
  console.log('listening on *: '+port);
});

io.on('connection', function(socket){

  socket.on('tv-kitchen', function(btnStr){
    sendToReceiver('tv-kitchen', btnStr);
  });
});

function sendToReceiver(reciverStr, btnStr){
  var receiverIp = getReceiverIp(reciverStr);
  var signal = getSignal(receiverStr, btnStr);
  request(receiverIp+'?signal='+signal, { json: true }, (err, res, body) => {
    if (err) {
      return console.log(err);
    }
    console.log(body.url);
    console.log(body.explanation);
  });
}

function getMimeType(filename) {
    var ext = path.extname(filename);

    var validExtensions = {
        ".html": "text/html",
        ".js": "application/javascript",
        ".css": "text/css",
        ".txt": "text/plain",
        ".jpg": "image/jpeg",
        ".gif": "image/gif",
        ".png": "image/png",
        ".woff": "application/font-woff",
        ".woff2": "application/font-woff2"
    };
    return validExtensions[ext];
}

function sendFile(filename, res) {
    var localPath = __dirname;
    localPath += ("/www" + filename);
    fs.exists(localPath, function(exists) {
        if (exists) {
            let mimeType = getMimeType(filename);
            getFile(localPath, res, mimeType);
        } else {
            console.log("File not found: " + localPath);
            res.writeHead(404);
            res.end();
        }
    });
}

function getFile(localPath, res, mimeType) {
    fs.readFile(localPath, function(err, contents) {
        if (!err) {

            if (mimeType != undefined) {
                res.setHeader("Content-Type", mimeType);
            }
            res.statusCode = 200;

            res.setHeader("Content-Length", contents.length);
            res.end(contents);
        } else {
            res.writeHead(500);
            res.end();
        }
    });
}
