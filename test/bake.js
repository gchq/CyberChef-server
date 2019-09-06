import request from "supertest";
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
            .expect("'recipe' property is required in request body", done);
    });

    it("should respond with the input if the recipe is empty", (done) => {
        request(app)
            .post("/bake")
            .send({input: "testing, one two three", recipe: []})
            .expect(200)
            .expect("testing, one two three", done);
    });

    it("should parse the recipe if it is a valid operation name", (done) => {
        request(app)
            .post("/bake")
            .set("Content-Type", "application/json")
            .send({input: "hello", recipe: "To Hexdump"})
            .expect(200)
            .expect("00000000  68 65 6c 6c 6f                                   |hello|", done);
    });

    it("should parse the recipe if it is a valid operation name string", (done) => {
        request(app)
            .post("/bake")
            .set("Content-Type", "application/json")
            .send({input: "hello", recipe: "toHexdump"})
            .expect(200)
            .expect("00000000  68 65 6c 6c 6f                                   |hello|", done);
    });

    it("should parse the recipe if it is an array of operation names", (done) => {
        request(app)
            .post("/bake")
            .set("Content-Type", "application/json")
            .send({input: "Testing, 1 2 3", recipe: ["to decimal", "MD5", "to braille"]})
            .expect(200)
            .expect("⠲⠆⠙⠋⠲⠆⠶⠶⠖⠶⠖⠙⠋⠶⠉⠆⠃⠲⠂⠑⠲⠢⠲⠆⠲⠒⠑⠶⠲⠢⠋⠃", done);
    });

    it("should parse the recipe if it is an operation with some custom arguments", (done) => {
        request(app)
            .post("/bake")
            .set("Content-Type", "application/json")
            .send({input: "Testing, 1 2 3", recipe: { op: "to hex", args: { delimiter: "Colon" }}})
            .expect(200)
            .expect("54:65:73:74:69:6e:67:2c:20:31:20:32:20:33", done);
    });

    // We know this breaks because an the moment the NodeRecipe validator cant handle an object with
    // an op but no argument
    it("should parse the recipe if it is an operation with no custom arguments", (done) => {
        request(app)
        .post("/bake")
        .set("Content-Type", "application/json")
        .send({input: "Testing, 1 2 3", recipe: {op: "to hex" }})
        .expect(200)
        .expect("54 65 73 74 69 6e 67 2c 20 31 20 32 20 33", done);
    });

    it("should parse a recipe in the compact JSON format taken from the CyberChef website", (done) => {
        request(app)
            .post("/bake")
            .set("Content-Type", "application/json")
            .send({input: "some input", recipe: [{"op": "To Morse Code", "args": ["Dash/Dot", "Backslash", "Comma"]}, {"op": "Hex to PEM", "args": ["SOMETHING"]}, {"op": "To Snake case", "args": [false]}]})
            .expect(200)
            .expect("begin_something_anananaaaaak_da_aaak_da_aaaaananaaaaaaan_da_aaaaaaanan_da_aaak_end_something", done);
    });

    it("should parse a recipe ib the clean JSON format taken from the CyberChef website", (done) => {
        request(app)
            .post("/bake")
            .set("Content-Type", "application/json")
            .send({input: "some input", recipe: [
                { "op": "To Morse Code",
                    "args": ["Dash/Dot", "Backslash", "Comma"] },
                { "op": "Hex to PEM",
                    "args": ["SOMETHING"] },
                { "op": "To Snake case",
                    "args": [false] }
            ]})
            .expect(200)
            .expect("begin_something_anananaaaaak_da_aaak_da_aaaaananaaaaaaan_da_aaaaaaanan_da_aaak_end_something", done);
    });

});
