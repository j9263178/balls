var http = require("http");
var url = require('url');
var fs = require('fs');
var io = require('socket.io');

var server = http.createServer(function(request, response){

   // response.writeHead(200, {'Content-Type': 'text/html'});
   // response.write('FUCK THE SERVER');
    var path = url.parse(request.url).pathname;

    switch (path) {
        case '/':
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.write('FUCK');
            response.end();
            break;

        case '/Socket.html':
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

        case '/tt.html':
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


var ball = function (id,x, y,size,color,sid) {
    this.sid=sid;
    this.color=color;
    this.online=true;
    this.id=id;
    this.dx=0;
    this.dy=0;
    this.ddx=0;
    this.ddy=0;
    this.x = x;
    this.y = y;
    this.size = size;

};

var balls=[];
var index=0;
var serv_io = io.listen(server);
var clints= {};

const func = function(socket) {
    var sessionID = socket.id;
    console.log(sessionID);
    clints[sessionID]=index;
    index+=1;

    socket.emit('message', {'message': 'From server: security guard.'});
    socket.emit('pos', {'pos': balls.length});

    socket.on('new', function(data) {
        balls.push(new ball(balls.length,data.x,data.y,data.size,data.color,socket.id));

    });

    setInterval(function () {
        socket.emit('balls', {'balls': balls});
    }, 12);

    socket.on('client_data', function(data) {
        balls[data.id].x=data.x;
        balls[data.id].y=data.y;
        balls[data.id].dx=data.dx;
        balls[data.id].dy=data.dy;
    });

    socket.on('disconnect', function() {
       // var i = allClients.indexOf(socket);
        console.log('Got disconnect!');
        var sessionID = socket.id;
        console.log(sessionID);
        balls[clints[sessionID]].online=false;
    });
};

serv_io.sockets.on('connection', func) ;

