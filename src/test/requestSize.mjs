import assert from "assert";
import request from "supertest";
import app from "../app.mjs";


describe("Request body size", function() {
    it("should accept bodies larger than the Express default of 100kb", (done) => {
        const input = "a".repeat(200 * 1024);
        request(app)
            .post("/bake")
            .send({input, recipe: []})
            .expect(200)
            .expect((res) => {
                assert.strictEqual(res.body.value, input);
            })
            .end(done);
    });

    it("should respond with 413 rather than 500 when the body exceeds the limit", (done) => {
        const input = "a".repeat(11 * 1024 * 1024);
        request(app)
            .post("/bake")
            .send({input, recipe: []})
            .expect(413)
            .expect(/^Request body too large/, done);
    });

    it("should respond with 400 rather than 500 for malformed JSON", (done) => {
        request(app)
            .post("/bake")
            .set("Content-Type", "application/json")
            .send("{\"input\": ")
            .expect(400, done);
    });
});
