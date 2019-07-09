const chai = require('chai');
const chaiHttp = require('chai-http');

const { expect } = chai;
chai.use(chaiHttp);

const app = require('../src/server');

describe('RSS', () => {
  describe('GET /rss without query url parameter', () => {
    it('should be return HTTP status 400', (done) => {
      chai.request(app)
        .get('/rss')
        .end((error, response) => {
          if (error) done(error);
          expect(response).to.have.status(400);
          done();
        });
    });
  });
});