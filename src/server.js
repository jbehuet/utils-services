import http from 'http';
import url from 'url';

import config from './config';
import { getHostname } from './Utils';

// Handlers
import FileHandler from './handlers/file.handler';
import ICSParserHandler from './handlers/icsParser.handler';

const requestHandler = (req, res) => {

    const origin = getHostname(req.headers.origin);
    console.log(origin)
    const fileHandler = new FileHandler(req, res);
    const icsParserHandler = new ICSParserHandler(req, res);

    if (config.allowedOrigins.indexOf(origin) > -1) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Request-Method', origin);
        res.setHeader('Access-Control-Allow-Headers', origin);
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



