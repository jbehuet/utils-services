import http from 'http';
import url from 'url';

import config from './config';
import { getHostname } from './Utils';

// Handlers
import FileHandler from './handlers/file.handler';
import ICSParserHandler from './handlers/icsParser.handler';

const requestHandler = (req, res) => {

    const parsedOrigin = url.parse(req.headers.origin);
    const fileHandler = new FileHandler(req, res);
    const icsParserHandler = new ICSParserHandler(req, res);

    if (config.allowedOrigins.indexOf(parsedOrigin.hostname) > -1) {
        res.setHeader('Access-Control-Allow-Origin', `${parsedOrigin.protocol}//${parsedOrigin.hostname}${(parsedOrigin.port ? ':'+ parsedOrigin.port :'')}`);
        res.setHeader('Access-Control-Request-Method', `${parsedOrigin.protocol}//${parsedOrigin.hostname}${(parsedOrigin.port ? ':'+ parsedOrigin.port :'')}`);
        res.setHeader('Access-Control-Allow-Headers', `${parsedOrigin.protocol}//${parsedOrigin.hostname}${(parsedOrigin.port ? ':'+ parsedOrigin.port :'')}`);
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



