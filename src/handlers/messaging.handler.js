import { Router } from "express";
import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync";
import fs from "fs";

const DB_FILE = "db/messaging.json";

class MessagingHandler {
  constructor() {
    this.router = Router();
    this.router.post("/subscribe", this.subscribe.bind(this));
    this.router.post("/unsubscribe", this.unsubscribe.bind(this));
    this.router.post("/notify/:app/all", this.notify.bind(this));

    this.adapter = new FileSync(DB_FILE);
    this._initDatabase();
  }

  _initDatabase() {
    this.db = low(this.adapter);
    if (!fs.existsSync(DB_FILE)) {
      this.db.defaults({ subscriptions: [] }).write();
    }
  }

  subscribe(req, res, next) {
    const subscription = this.db
      .get("subscriptions")
      .find(
        subscription =>
          subscription.application === req.body.application &&
          subscription.token === req.body.token
      )
      .value();

    if (!subscription) {
      this.db
        .get("subscriptions")
        .push({
          application: req.body.application,
          token: req.body.token,
          data: req.body.data
        })
        .write();
      res.status(201).send("Subscription created");
    } else {
      res.status(409).send("Subscription exist");
    }
  }

  unsubscribe(req, res, next) {
    this.db
      .get("subscriptions")
      .remove(
        subscription =>
          subscription.application === req.body.application &&
          subscription.token === req.body.token
      )
      .write();
    res.status(200).send("Subscription deleted");
  }

  notify(req, res, next) {}
}

export default MessagingHandler;
