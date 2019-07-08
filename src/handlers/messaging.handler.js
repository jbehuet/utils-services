import { Router } from "express";
import Datastore from "nedb";
import FCM from "fcm-push";
import config from "../config";

const DB_FILE = "./db/subscriptions.db";

class MessagingHandler {
  constructor() {
    this.router = Router();
    this.router.post("/subscribe", this.subscribe.bind(this));
    this.router.post("/unsubscribe", this.unsubscribe.bind(this));
    this.router.get(
      "/subscription/:app/:token",
      this.getSubscription.bind(this)
    );
    this.router.put(
      "/subscription/:subscription_id",
      this.updateSubscription.bind(this)
    );
    this.router.post("/notify/:app/:token", this.notify.bind(this));

    this._initDatabase();
  }

  _initDatabase() {
    this.db = new Datastore({ filename: DB_FILE });
    this.db.loadDatabase();
  }

  subscribe(req, res, next) {
    this.db.findOne(
      { application: req.body.application, token: req.body.token },
      (err, doc) => {
        if (doc) {
          res.status(409).send();
        } else {
          this.db.insert(req.body, (err, doc) => {
            res.status(201).json(doc);
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
          res.status(200).send();
        } else {
          res.status(500).send(err);
        }
      }
    );
  }

  getSubscription(req, res, next) {
    // Get subscription with app and token
    this.db.findOne(
      { application: req.params.app, token: req.params.token },
      (err, subscription) => {
        if (!!subscription) {
          res.json(subscription);
        } else {
          res.status(404).send();
        }
      }
    );
  }

  updateSubscription(req, res, next) {
    // Update subscription form subscription id
    this.db.update(
      { _id: req.params.subscription_id },
      { ...req.body },
      {},
      (err, numReplaced) => {
        if (numReplaced > 0) {
          res.status(200).send();
        } else {
          res.status(404).send();
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

    // GET FCM with APP
    const fcm = new FCM(config.FCM);

    if (req.params.token === "all") return this.notifyAll(req, res, next);
    const message = {
      to: req.params.token,
      notification: {
        title: req.body.title,
        body: req.body.body
      },
      data: {}
    };

    fcm
      .send(message)
      .then(() => res.status(200).send("Sent successfull"))
      .catch(err => res.status(500).send(err));
  }
}

export default MessagingHandler;
