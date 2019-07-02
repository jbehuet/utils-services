import { Router } from 'express';
import Feed from 'rss-to-json';

class RSSParserHandler {

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
            Feed.load(req.query.url, (err, rss)=>{
                res.json(rss);
            })
        }
    }
}

export default RSSParserHandler;