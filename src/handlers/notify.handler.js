import { Router } from 'express';

class NotifyHandler {

    constructor() {
        this.router = Router();
        this.router.post('/subscribe', this.subscribe.bind(this));
        this.router.post('/unsubscribe', this.unsubscribe.bind(this));
        this.router.post('/notify', this.notify.bind(this));
    }

    subscribe(req, res, next) {

    }

    unsubscribe(req, res, next) {

    }

    notify(req, res, next) {

    }
}

export default NotifyHandler;