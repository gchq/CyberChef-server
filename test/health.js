import request from "supertest";
import app from "../app";

describe("GET /health", function() {
    it("should respond with a success response", function(done) {
        request(app)
            .get("/health")
            .set("Accept", "application/json")
            .expect(200, done);
    });
});
