import { existsSync } from 'node:fs';
import { readFileSync } from 'node:fs';

const net = require("net");
const process = require('node:process')


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
    const process_arguments = process.argv
    console.log(process_arguments)
    
    // console.log(MATCH)
    if(MATCH) {
      const method = MATCH[1]
      const url = MATCH[2]
      const str = SEARCHSTRING.exec(url)
      // console.log(url)
      
      if(method === 'GET') {
        if(url === '/'){
          socket.write('HTTP/1.1 200 OK\r\n\r\n')
        }  else if(url.includes('/files/')) {
            // socket.write(`HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: 13\r\n\r\nHello, World!`)
            const directory = process_arguments[3];
            const filename = url.split("/files/")[1];
            const filePath = `../${directory}/${filename}`;
            
            if (existsSync(filePath)) {
                // Respond with the file content
                const content = readFileSync(filePath).toString();
                const res = `HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${Buffer.byteLength(content)}\r\n\r\n${content}`;
                socket.write(res);
                socket.end();
            } else {
                // Respond with 404 Not Found
                const res = 'HTTP/1.1 404 Not Found\r\nContent-Length: 0\r\n\r\n';
                socket.write(res);
            }
        } else if(str){
            socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${str[1].length}\r\n\r\n${str[1]}`)
        } else if(url === '/user-agent' && MATCHUSERAGENT) {
            socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${MATCHUSERAGENT[1].length}\r\n\r\n${MATCHUSERAGENT[1]}`)
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
