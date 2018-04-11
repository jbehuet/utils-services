import { Router } from 'express';

class NotifyHandler {

    constructor() {
        this.router = Router();
        this.router.post('/subsribe', this.subsribe.bind(this));
        this.router.post('/unsubsribe', this.subsribe.bind(this));
        this.router.post('/notify', this.subsribe.bind(this));
    }

    subsribe(req, res, next) {
        
    }

    unsubsribe(req, res, next) {
        
    }

    notify(req, res, next) {
        
    }
}

export default NotifyHandler;