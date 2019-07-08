import http from 'http';
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import url from 'url';

import config from './config';

// Handlers
import ICSParserHandler from './handlers/icsParser.handler';
import RSSParserHandler from './handlers/rssParser.handler';
import MessagingHandler from './handlers/messaging.handler';

// Express application
const app = express();
app.use(bodyParser.json());
app.use(methodOverride());

// STATIC
app.use(express.static(path.resolve(__dirname, '../public/')));

// CORS
app.use((req, res, next) => {
    if (req.headers.origin && config.allowedOrigins.indexOf(url.parse(req.headers.origin).hostname) > -1) {
        res.setHeader('Access-Control-Allow-Origin', "*");
        res.setHeader('Access-Control-Request-Method', "*");
        res.setHeader('Access-Control-Allow-Headers', "*");
        res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');
    }
    next();
})

// Handlers
app.use('/ics', new ICSParserHandler().router);
app.use('/rss', new RSSParserHandler().router);
app.use('/messaging', new MessagingHandler().router);

// Error handler
app.use((err, req, res, next) => {
    res.status(400).json({ message: err.message });
})

// Index
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../public/', 'index.html'));
});

// Redirect otherwise
app.get('*', (req, res) => {
    res.redirect('/');
});

const server = http.createServer(app);
server.listen(config.port);

console.log('Server listening on ' + config.port)



