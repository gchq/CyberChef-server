import request from "supertest"
import app from "../app";

describe('GET /', function() {
    it('responds with json', function(done) {
      request(app)
        .get('/')
        .set('Accept', 'application/json')
        .expect('Content-Type', /text\/plain; charset=utf-8/)
        .expect(200, done);
    });
  });


