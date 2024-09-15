const fs = require('node:fs');
const { createServer } = require('node:http');
const hostname = '127.0.0.1';
const port = 3000;

const server = createServer((req, res) => {
    switch (req.url) {
        case '/': {
            const data = fs.readFileSync('../HTML/LandingPage.html', 'utf8');
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.end(data);
            break;
        }

        case '/Scripts/Utils.js': {
            const data = fs.readFileSync('../Scripts/Utils.js', 'utf8');
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/javascript');
            res.end(data);
            break;
        }

        default: {
            const data = fs.readFileSync('../HTML/LandingPage.html', 'utf8');
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.end(data);
            break;
        }
    }
});
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});