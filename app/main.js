const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// TODO: Uncomment the code below to pass the first stage
const server = net.createServer((socket) => {

  socket.on("data", (data) => {
    // console.log(data.toString().split(" "))
    const requestString = data.toString()
    const URLREGEX = /(GET|PUT|DELETE|POST)\s([^\s\r\n]*)/
    const SEARCHSTRING = /\/\w+\/(.*)/
    const USERAGENTREGEX = /User-Agent:\s([^\r\n]*)/
 
    const MATCH = URLREGEX.exec(requestString)
    const MATCHUSERAGENT = USERAGENTREGEX.exec(requestString)

    // console.log(MATCH)
    if(MATCH) {
      const method = MATCH[1]
      const url = MATCH[2]
      const str = SEARCHSTRING.exec(url)
      
      if(method === 'GET') {
        if(url === '/'){
          socket.write('HTTP/1.1 200 OK\r\n\r\n')
        } else if(str){
            socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${str[1].length}\r\n\r\n${str[1]}`)
        } else if(url === '/user-agent' && MATCHUSERAGENT) {
            socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${MATCHUSERAGENT[1]}\r\n\r\n${MATCHUSERAGENT[1]}`)
        } else socket.write('HTTP/1.1 404 Not Found\r\n\r\n')
      }
    }
    socket.end()
  })

  socket.on("close", () => {
    socket.end();
  });

  
  // socket.write('HTTP/1.1 200 OK\r\n\r\n')
});


server.listen(4221, "localhost");
