var http = require("http");
var url = require('url');
var fs = require('fs');
var io = require('socket.io');

var server = http.createServer(function(request, response){
    console.log('Connection');
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


var ball = function (x, y,size) {
    this.dx=0;
    this.dy=0;
    this.ddx=0;
    this.ddy=0;
    this.x = x;
    this.y = y;
    this.size = size;
    this.draw=function(){
        this.update();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
        ctx.fillStyle = "#ffc332";
        ctx.fill();
        ctx.closePath();
    }

    this.update=function () {
        this.dx += this.ddx;
        this.dy += this.ddy;
        this.x += this.dx;
        this.y += this.dy;
    }
};

var balls=[];



var serv_io = io.listen(server);

const func = function(socket) {
    socket.emit('message', {'message': 'From server: security guard.'});
    socket.emit('pos', {'pos': balls.length});

    socket.on('new', function(data) {
        balls.push(new ball(data.x,data.y,data.size));
    });

    setInterval(function () {
        socket.emit('balls', {'balls': balls});
    }, 10);

    socket.on('client_data', function(data) {
        balls[data.id].x=data.x;
        balls[data.id].y=data.y;
        balls[data.id].dx=data.dx;
        balls[data.id].dy=data.dy;
    });
};

serv_io.sockets.on('connection', func) ;

