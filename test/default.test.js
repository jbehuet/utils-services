const chai = require('chai');
const chaiHttp = require('chai-http');

const { expect } = chai;
chai.use(chaiHttp);

const app = require('../src/server').app;

describe('Default', () => {
  describe('GET /', () => {
    it('should be return HTTP status 200', (done) => {
      chai.request(app)
        .get('/')
        .end((error, response) => {
          if (error) done(error);
          expect(response).to.have.status(200);
          done();
        });
    });
  });

  describe('GET /not_exist', () => {
    it('should be return HTTP status 200', (done) => {
      chai.request(app)
        .get('/not_exist')
        .end((error, response) => {
          if (error) done(error);
          expect(response).to.have.status(200);
          done();
        });
    });
  });

  describe('POST /not_exist', () => {
    it('should be return HTTP status 404', (done) => {
      chai.request(app)
        .post('/not_exist')
        .end((error, response) => {
          if (error) done(error);
          expect(response).to.have.status(404);
          done();
        });
    });
  });

  describe('PUT /not_exist', () => {
    it('should be return HTTP status 404', (done) => {
      chai.request(app)
        .put('/not_exist')
        .end((error, response) => {
          if (error) done(error);
          expect(response).to.have.status(404);
          done();
        });
    });
  });

  describe('DELETE /not_exist', () => {
    it('should be return HTTP status 404', (done) => {
      chai.request(app)
        .delete('/not_exist')
        .end((error, response) => {
          if (error) done(error);
          expect(response).to.have.status(404);
          done();
        });
    });
  });
});