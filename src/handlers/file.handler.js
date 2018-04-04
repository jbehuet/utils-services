import path from 'path';
import fs from 'fs';

import RequestHandler from "./request.handler";
import config from '../config';
import constants from '../constants';

class FileHandler extends RequestHandler {

    constructor(req, res) {
        super(req, res);
    }

    render() {
        let file = path.normalize(path.join(__dirname, '../..', config.public + this.req.url));
        file = (file == path.join(__dirname, '../..', config.public) + '/') ? file + config.index : file;

        const ext = path.parse(file).ext;
        
        console.log('Trying to serve: ', file);

        fs.exists(file, (exists) => {
            if (exists) {
                fs.stat(file, (error, stat) => {
                    let readStream;

                    if (error) {
                        return this.showError(error);
                    }

                    if (stat.isDirectory()) {
                        this.res.writeHead(403);
                        this.res.end('Forbidden');
                    }
                    else {
                        readStream = fs.createReadStream(file);

                        readStream.on('error', this.showError);

                        this.res.setHeader('Content-type', constants.ext[ext] || 'text/plain');
                        this.res.writeHead(200);
                        readStream.pipe(this.res);
                    }
                });
            } else {
                this.res.writeHead(404);
                this.res.end('Not found');
            }

        })
    }
}

export default FileHandler;