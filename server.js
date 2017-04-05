var http = require('http');

http.createServer(function (req, res) {
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('Hello Testing for Quin model1');
    
}).listen(process.env.PORT || 8080);
