const net = require("net");
const readline = require("readline");
const fs = require('node:fs/promises')
const process = require('node:process')
const path = require('node:path')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  promt: "$"
})

rl.prompt()

rl.on("line", async (command) => {
  if (command == '--directory'){
    process.chdir(command[2])
  }
  rl.prompt()


})

// You can use print statements as follows for debugging, they'll be visible when running tests.
// TODO: Uncomment the code below to pass the first stage
const server = net.createServer((socket) => {

  socket.on("data", (data) => {
    // console.log(data.toString().split(" "))
    const requestString = data.toString()
    const URLREGEX = /(GET|PUT|DELETE|POST)\s([^\s\r\n]*)/
    const SEARCHSTRING = /\/\w+\/(.*)/
    const USERAGENTREGEX = /User-Agent:\s([^\r\n]*)/
    const DIRECTORYREGEX = /--directory\s([^\s])/
    
    const MATCH = URLREGEX.exec(requestString)
    const MATCHUSERAGENT = USERAGENTREGEX.exec(requestString)
    // const directory = DIRECTORYREGEX.exec(requestString)

    // console.log(MATCH)
    if(MATCH) {
      const method = MATCH[1]
      const url = MATCH[2]
      const str = SEARCHSTRING.exec(url)
      // console.log(url)
      
      if(method === 'GET') {
        if(url === '/'){
          socket.write('HTTP/1.1 200 OK\r\n\r\n')
        } else if(str){
            socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${str[1].length}\r\n\r\n${str[1]}`)
        } else if(url === '/user-agent' && MATCHUSERAGENT) {
            socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${MATCHUSERAGENT[1].length}\r\n\r\n${MATCHUSERAGENT[1]}`)
        } else if(url.includes('/files/')) {
            socket.write(`HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: 13\r\n\r\nHello, World!`)
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
