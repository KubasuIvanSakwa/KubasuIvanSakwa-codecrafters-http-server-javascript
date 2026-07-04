const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// TODO: Uncomment the code below to pass the first stage
const server = net.createServer({ port: 4221 }, (socket) => {
  socket.on("close", () => {
    socket.write('HTTP/1.1 200 OK\r\n\r\n')
    socket.end();
  });
});

server.on('error', (err) => {
  console.log('HTTP/1.1 404 Not Found\r\n\r\n')
  server.end()
})

server.listen(4221, "localhost");
