const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// TODO: Uncomment the code below to pass the first stage
const server = net.createServer((socket) => {
  console.log(socket)
  if(socket.method === 'GET') {
    socket.write('HTTP/1.1 200 OK\r\n\r\n')
    socket.end()
  }
  socket.on("close", () => {
    socket.end();
  });
  
  socket.write('HTTP/1.1 200 OK\r\n\r\n')
}).on('error', (err) => {
  socket.write('HTTP/1.1 404 Not Found\r\n\r\n')
});


server.listen(4221, "localhost");
