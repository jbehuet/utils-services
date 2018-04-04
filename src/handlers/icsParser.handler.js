import fetch from 'node-fetch';
import ical from 'ical.js';

import RequestHandler from "./request.handler";

class ICSParserHandler extends RequestHandler {

    constructor(req, res) {
        super(req, res);
    }

    flattenEvent(e) {
        const event = {};
        for (let i in e[1]) {
            const prop = e[1][i];
            event[prop[0]] = e[1][i][3];
        }
        return event;
    }

    parse(url) {
        fetch(url)
            .then(response => response.text())
            .then(data => {
                let parsed = ical.parse(data);
                let events = parsed[2];
                let result = events.map(e => this.flattenEvent(e));
                this.res.writeHeader(200, { "Content-Type": "application/json" });
                this.res.write(JSON.stringify(result));
                this.res.end();
            })
            .catch(e => this.showError(e));
    }
}

export default ICSParserHandler;