var http = require("http");
var url = require('url');
var fs = require('fs');
var io = require('socket.io');

var server = http.createServer(function(request, response){

  var path = url.parse(request.url).pathname;

  switch (path) {
    case '/':
      response.writeHead(200, {'Content-Type': 'text/html'});
      response.write('FUCK');
      response.end();
      break;

    case '/p5.play.html':
      fs.readFile(__dirname + path, function(error, data) {
        if (error){
          response.writeHead(404);
          response.write("You get a fucking 404");
        } else {
          response.writeHead(200, {"Content-Type": "text/html"});
          response.write(data, "utf8");
        }
        response.end();
      });
      break;

    default:
      response.writeHead(404);
      response.write("You get a fucking 404");
      response.end();
      break;
  }
});

server.listen(8001);
io.listen(server); // 開啟 Socket.IO 的 listener


thing=function(ani,x,y,sid){
  this.sid=sid;
  this.online=true;
  this.ani=ani;
  this.x=x;
  this.y=y;
  this.dx=0;
  this.dy=0;
  this.x = x;
  this.y = y;
};

var things=[];
var index=0;
var serv_io = io.listen(server);
var clints= {};

function getRandom(min,max){
  return Math.floor(Math.random()*(max-min+1))+min;
}


serv_io.sockets.on('connection',
  function(socket) {
  var sessionID = socket.id;
  console.log(sessionID);
  clints[sessionID]=index;
  index+=1;

  //give the client its index in things
  socket.emit('pos', {'pos': things.length});

  //create a new thing in things
  things.push(new thing(1,data.x,data.y,socket.id));

  //send updated things to client
  setInterval(function () {
    socket.emit('update', {'things': things});
  }, 12);

  //get client input
  socket.on('client_data', function(data) {
    things[data.id].dx=data.dx;
    things[data.id].dy=data.dy;
  });

  //handle disconnection
  socket.on('disconnect', function() {
    console.log('Got disconnect!');
    var sessionID = socket.id;
    console.log(sessionID);
    things[clints[sessionID]].online=false;
    });
  }

) ;

