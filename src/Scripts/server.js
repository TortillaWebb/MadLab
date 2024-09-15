const fs = require('node:fs');
const {createServer} = require('node:http');

const hostname = '127.0.0.1';
const port = 3000;

const server = createServer((req, res) => {

    console.log(req);

    try {

        switch (req.url) {
            case '/': {
                const data = fs.readFileSync('./src/HTML/LandingPage.html', 'utf8');
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');
                res.end(data);
                break;
            }

            case '/Scripts/Utils.js': {
                const data = fs.readFileSync('./src/Scripts/Utils.js', 'utf8');
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/javascript');
                res.end(data);
                break;
            }

            case '/Assets/MadLabLogo.jpg': {
                const data = fs.readFileSync('./src/Assets/MadLabLogo.jpg');
                res.statusCode = 200;
                res.setHeader('Content-Type', 'image/jpeg');
                res.end(data);
                break;
            }

            case '/Assets/style.css': {
                const data = fs.readFileSync('./src/Assets/style.css', 'utf8');
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/css');
                res.end(data);
                break;
            }

            default: {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'text/html')
                res.end("<p> Page not found </p>");
                break;
            }
        }
    } catch (error) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html')
        res.end("<p> Page not found </p>");
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

