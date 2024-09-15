const fs = require('node:fs');
const { createServer } = require('node:http');
const hostname = '127.0.0.1';
const port = 3000;

const server = createServer((req, res) => {
    const data = fs.readFileSync('../HTML/LandingPage.html', 'utf8');
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end(data);
});
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});