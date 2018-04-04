import http from 'http';
import url from 'url';

import config from './config';

// Handlers
import FileHandler from './handlers/file.handler';
import ICSParserHandler from './handlers/icsParser.handler';

const requestHandler = (req, res) => {

    const fileHandler = new FileHandler(req, res);
    const icsParserHandler = new ICSParserHandler(req, res);

    if (req.headers.origin && config.allowedOrigins.indexOf(url.parse(req.headers.origin).hostname) > -1) {
        res.setHeader('Access-Control-Allow-Origin', "*");
        res.setHeader('Access-Control-Request-Method', "*");
        res.setHeader('Access-Control-Allow-Headers', "*");
        res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    }

    const query = url.parse(req.url, true).query;
    if (!query.url) {
        fileHandler.render();
    } else {
        icsParserHandler.parse(query.url);
    }
}

const server = http.createServer(requestHandler);
server.listen(config.port);

console.log('Server listening on ' + config.port)



