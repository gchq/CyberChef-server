const request = require('supertest');
const app = require('../app');

describe('GET /users', function() {
    it('responds with json', function(done) {
      request(app)
        .get('/users')
        .set('Accept', 'application/json')
        .expect('Content-Type', /text\/html; charset=utf-8/)
        .expect(200, done);
    });
  });


