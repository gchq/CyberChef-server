import request from "supertest"
import app from "../app";

describe("GET /bake", function() {
    it("doesnt exist", function(done) {
        request(app)
            .get("/bake")
            .set("Accept", "application/json")
            .expect(404, done);
    });
});

describe("POST /bake", function() {
    it("should error helpfully if there's no `input` property in request body", (done) => {
        request(app)
        .post("/bake")
        .send({})
        .expect(400)
        .expect("'input' property is required in request body", done);
    });

    it("should error helpfully if there's no `recipe` property in request body", (done) => {
        request(app)
        .post("/bake")
        .send({input: "hello"})
        .expect(400)
        .expect("'recipe' property is required in request body", done)
    });

    it("should respond with the input if the recipe is empty", (done) => {
        request(app)
        .post("/bake")
        .send({input: "testing, one two three", recipe: []})
        .expect(200)
        .expect("testing, one two three", done);
    });

    it("should parse the recipe if it is a valid JSON string", (done) => {
        request(app)
        .post("/bake")
        .set("Content-Type", "application/json")
        .send({input: "hello", recipe: `[{"op":"To Hexdump"}]`})
        .expect(200)
        .expect("00000000  68 65 6c 6c 6f                                   |hello|", done);
    })
});




