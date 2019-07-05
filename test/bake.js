const request = require('supertest');
const app = require('../app');

describe('GET /bake', function() {
    it('doesnt exist', function(done) {
        request(app)
            .get('/bake')
            .set('Accept', 'application/json')
            .expect(404, done);
    });
});

describe('POST /bake', function() {
    it('should respond with 200', function(done) {
        request(app)
        .post('/bake')
        .expect(200, done);
    });
});




