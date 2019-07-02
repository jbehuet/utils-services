import { Router } from "express";
import Datastore from "nedb";
import FCM from "fcm-push";
import config from "../config";

const DB_FILE = "./db/messaging.db";

class MessagingHandler {
  constructor() {
    this.router = Router();
    this.router.post("/subscribe", this.subscribe.bind(this));
    this.router.post("/unsubscribe", this.unsubscribe.bind(this));
    this.router.post("/notify/:app/:token", this.notify.bind(this));

    this._initDatabase();
    this._initFCM();
  }

  _initDatabase() {
    this.db = new Datastore({ filename: DB_FILE });
    this.db.loadDatabase();
  }

  _initFCM() {
    if (!config.FCM) return;
    this.fcm = new FCM(config.FCM);
  }

  subscribe(req, res, next) {
    this.db.findOne(
      { application: req.body.application, token: req.body.token },
      (err, doc) => {
        if (doc) {
          res.status(409).send("Subscription exist");
        } else {
          this.db.insert(req.body, (err, doc) => {
            res.status(201).send("Subscription created");
          });
        }
      }
    );
  }

  unsubscribe(req, res, next) {
    this.db.remove(
      { application: req.body.application, token: req.body.token },
      err => {
        if (!err) {
          res.status(200).send("Subscription deleted");
        } else {
          res.status(500).send(err);
        }
      }
    );
  }

  notifyAll(req, res, next) {
    this.db.find({ application: req.params.app }, (err, subscriptions) => {
      Promise.all(
        subscriptions.map(subscription => {
          const message = {
            to: subscription.token,
            notification: {
              title: req.body.title,
              body: req.body.body
            },
            data: {}
          };

          return this.fcm.send(message);
        })
      )
        .then(() =>
          res
            .status(200)
            .send(`Sent successfull to ${subscription.length} users`)
        )
        .catch(err => res.status(500).send(err));
    });
  }

  notify(req, res, next) {
    if (!config.FCM) {
      res.status(503).send("FCM not available");
      return;
    }

    if (req.params.token === "all") return this.notifyAll(req, res, next);
    const message = {
      to: req.params.token,
      notification: {
        title: req.body.title,
        body: req.body.body
      },
      data: {}
    };

    this.fcm
      .send(message)
      .then(() => res.status(200).send("Sent successfull"))
      .catch(err => res.status(500).send(err));
  }
}

export default MessagingHandler;
