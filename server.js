var chatlog = [];
var listeners = [];

require('http').createServer(function (req, res) {
  var signature = req.method + ' ' + req.url;
  if (signature === 'GET /') {
    require('fs').readFile('client.html', 'utf8',
      function (err, data) {
        res.writeHead(200, {'content-type': 'text/html'});
        res.end(data);
      });
  } else if (signature === 'POST /send') {
    var chunks = [];
    req.on('data', function (chunk) {
      chunks.push(chunk);
    });
    req.on('end', function () {
      // Send stuff to all listeners
      var joined = chunks.join('');
      chatlog.push(joined);
      listeners.forEach(function (listener) {
        listener.writeHead(200, {'content-type': 'text/plain'});
        listener.end(joined);
      });
      listeners = [];
    });

    res.writeHead(200);
    res.end('Sent');
  } else if (signature === 'GET /log') {
    res.writeHead(200, {'content-type': 'application/json'});
    res.end(JSON.stringify(chatlog));
  } else if (signature === 'GET /listen') {
    // Stash the reply so we can send text to it later
    listeners.push(res);
  } else {
    res.writeHead(404);
    res.end('Not found: ' + req.url);
  }
}).listen(8080);
