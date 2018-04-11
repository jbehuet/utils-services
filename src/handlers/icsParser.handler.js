import { Router } from 'express';
import fetch from 'node-fetch';
import ical from 'ical.js';

class ICSParserHandler {

    constructor(req, res) {
        this.router = Router();
        this.router.get('/', this.parse.bind(this));
    }

    flattenEvent(e) {
        const event = {};
        for (let i in e[1]) {
            const prop = e[1][i];
            event[prop[0]] = e[1][i][3];
        }
        return event;
    }

    parse(req, res, next) {
        if (!req.query.url) {
            next({ message: 'Missing url parameter' });
        } else {
            fetch(req.query.url)
                .then(response => response.text())
                .then(data => {
                    try {
                        let parsed = ical.parse(data);
                        let events = parsed[2];
                        let result = events.map(e => this.flattenEvent(e));
                        res.json(result);
                    } catch (error) {
                        next(error)
                    }

                })
                .catch(e => next(e));
        }
    }
}

export default ICSParserHandler;