const fs = require("fs");
const chai = require("chai");
const chaiHttp = require("chai-http");

const { expect } = chai;
chai.use(chaiHttp);

const app = require("../src/server").app;
const BASE_URL = "/messaging";

const subscription = {
  application: "app_test",
  token: "token_test",
  data: {}
};

describe("Messaging", () => {
  before(() => {
    fs.unlinkSync("./db/subscriptions.db", err => {
      if (err) throw err;
    });
  });

  describe(`POST ${BASE_URL}/subscribe`, () => {
    it("should be return HTTP status 201", done => {
      chai
        .request(app)
        .post(`${BASE_URL}/subscribe`)
        .send(subscription)
        .end((error, response) => {
          if (error) done(error);
          expect(response).to.have.status(201);
          done();
        });
    });
  });

  describe(`GET ${BASE_URL}/subscription/${subscription.application}/${
    subscription.token
  }`, () => {
    it("should be return HTTP status 200 and correct subscription object", done => {
      chai
        .request(app)
        .get(
          `${BASE_URL}/subscription/${subscription.application}/${
            subscription.token
          }`
        )
        .end((error, response) => {
          if (error) done(error);
          expect(response).to.have.status(200);
          expect(response.body.application).to.equal(subscription.application);
          expect(response.body.token).to.equal(subscription.token);
          done();
        });
    });
  });

  describe(`POST ${BASE_URL}/unsubscribe with an not existing subscription`, () => {
    it("should be return HTTP status 404", done => {
      chai
        .request(app)
        .post(`${BASE_URL}/unsubscribe`)
        .send({ application: "", token: "", data: {} })
        .end((error, response) => {
          if (error) done(error);
          expect(response).to.have.status(404);
          done();
        });
    });
  });

  describe(`POST ${BASE_URL}/unsubscribe with an existing subscription`, () => {
    it("should be return HTTP status 200", done => {
      chai
        .request(app)
        .post(`${BASE_URL}/unsubscribe`)
        .send(subscription)
        .end((error, response) => {
          if (error) done(error);
          expect(response).to.have.status(200);
          done();
        });
    });
  });
});
