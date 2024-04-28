var http = require('http');
var fs = require('fs');

var index = fs.readFileSync('index.html');

var serialPort = require("serialport");

const parsers = serialPort.parsers;
const parser = new parsers.Readline({
    delimiter: '\r\n'
});

var port = new serialPort('COM3',
{   bauRate: 9600,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false
}
);

port.pipe(parser);

var app = http.createServer(function(req,res) {

    res.writeHead(200, {'Content-Type':'text/html'});
    res.end(index);

});


var io = require('socket.io').listen(app);

io.on('connection', function(data){

    console.log("nodejs is listening!");

});

parser.on('data', function(data){

    console.log(data);

    io.emit('data',data);

});

app.listen(3000);
