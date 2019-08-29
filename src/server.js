import 'babel-polyfill';
import path from "path";
import express from "express";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import url from "url";

import config from "./config";

// Handlers
import ICSParserHandler from "./handlers/icsParser.handler";
import RSSParserHandler from "./handlers/rssParser.handler";
import MessagingHandler from "./handlers/messaging.handler";

class Server {
  constructor() {
    this.app = express();

    this.app.on("ready", () => {
      this.app.listen(config.port, () => {
        if (process.env.NODE_ENV !== "test") {
          console.log(
            `API (${process.env.NODE_ENV}) running on http://localhost:${config.port}/api`
          );
        }
      });
    });

    this._setupMiddlewares();
    this._setupHandlers();
  }

  _setupMiddlewares() {
    // Parse application/x-www-form-urlencoded
    this.app.use(bodyParser.urlencoded({ extended: false, limit: "1mb" }));
    // Parse application/json
    this.app.use(bodyParser.json({}));
    this.app.use(methodOverride());

    // STATIC
    this.app.use(express.static(path.resolve(__dirname, "../public/")));

    // CORS
    this.app.use((req, res, next) => {
      if (
        req.headers.origin &&
        config.allowedOrigins.indexOf(url.parse(req.headers.origin).hostname) >
        -1
      ) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Request-Method", "*");
        res.setHeader("Access-Control-Allow-Headers", "*");
        res.setHeader(
          "Access-Control-Allow-Methods",
          "OPTIONS, GET, POST, PUT, DELETE"
        );
      }
      next();
    });
  }

  _setupHandlers() {
    // Handlers
    this.app.use("/ics", new ICSParserHandler().router);
    this.app.use("/rss", new RSSParserHandler().router);
    this.app.use("/messaging", new MessagingHandler().router);

    // Error handler
    this.app.use((err, req, res, next) => {
      res.status(400).json({ message: err.message });
    });

    // Index
    this.app.get("/", (req, res) => {
      res.sendFile(path.resolve(__dirname, "../public/", "index.html"));
    });

    // Redirect otherwise
    this.app.get("*", (req, res) => {
      res.redirect("/");
    });
  }
}

const server = new Server();

if (process.env.NODE_ENV === "test") {
  module.exports = server;
} else {
  server.app.emit("ready");
}
