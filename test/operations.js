import assert from "assert";
import request from "supertest";
import app from "../app";

describe("GET /operations", function() {
    it("exists", (done) => {
        request(app)
            .get("/operations")
            .expect(200, done);
    });

    it("contains some operations", (done) => {
        request(app)
            .get("/operations")
            .expect(200)
            .end(function(err, res) {
                if(err) return done(err);
                assert.notStrictEqual(res.body.ToBraille, undefined);
                assert.notStrictEqual(res.body.ToBase, undefined);
                done();
            });
    });
});
