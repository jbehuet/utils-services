import { Router } from 'express';
import Parser from 'rss-parser';

class RSSParserHandler {

    constructor(req, res) {
        this.parser = new Parser();
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

    async parse(req, res, next) {
        if (!req.query.url) {
            next({ message: 'Missing url parameter' });
        } else {
            const feed = await this.parser.parseURL(req.query.url);
            res.json(feed);
        }
    }
}

export default RSSParserHandler;