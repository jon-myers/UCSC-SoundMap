const http = require('http');
const url = require('url');
const fs = require('fs');
// const funcs = require('funcs.js');

http.createServer( (req, res) => {
  const q = url.parse(req.url, true);
  if (q.pathname == '/getcoords') {
    res.writeHead(200, {'Content-Type': 'text/css'});
    res.write('404.2289, -122.3876');
    res.end();
  };

  const filename = "." + q.pathname;
  console.log(filename);
  fs.readFile(filename, (err, data) => {
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'});
      return res.end("404 Not Found");
    };
    if (filename.slice(-3) == 'css') {
      res.writeHead(200, {'Content-Type': 'text/css'});
    } else {
      res.writeHead(200, {'Content-Type': 'text/html'});
    };

    res.write(data);
    return res.end();
  });
}).listen(8080);
