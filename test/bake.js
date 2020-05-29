import request from "supertest";
import app from "../app";

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
            .expect({
                value: "testing, one two three",
                type: "string",
            }, done);
    });

    it("should parse the recipe if it is a valid operation name", (done) => {
        request(app)
            .post("/bake")
            .set("Content-Type", "application/json")
            .send({input: "hello", recipe: "To Hexdump"})
            .expect(200)
            .expect({
                value: "00000000  68 65 6c 6c 6f                                   |hello|",
                type: "string",
            }, done);
    });

    it("should parse the recipe if it is a valid operation name string", (done) => {
        request(app)
            .post("/bake")
            .set("Content-Type", "application/json")
            .send({input: "hello", recipe: "toHexdump"})
            .expect(200)
            .expect({
                value: "00000000  68 65 6c 6c 6f                                   |hello|",
                type: "string",
            }, done);
    });

    it("should parse the recipe if it is an array of operation names", (done) => {
        request(app)
            .post("/bake")
            .set("Content-Type", "application/json")
            .send({input: "Testing, 1 2 3", recipe: ["to decimal", "MD5", "to braille"]})
            .expect(200)
            .expect({
                value: "⠲⠆⠙⠋⠲⠆⠶⠶⠖⠶⠖⠙⠋⠶⠉⠆⠃⠲⠂⠑⠲⠢⠲⠆⠲⠒⠑⠶⠲⠢⠋⠃",
                type: "string",
            }, done);
    });

    it("should parse the recipe if it is an operation with some custom arguments", (done) => {
        request(app)
            .post("/bake")
            .set("Content-Type", "application/json")
            .send({input: "Testing, 1 2 3", recipe: { op: "to hex", args: { delimiter: "Colon" }}})
            .expect(200)
            .expect({
                value: "54:65:73:74:69:6e:67:2c:20:31:20:32:20:33",
                type: "string",
            }, done);
    });

    it("should parse the recipe if it is an operation with no custom arguments", (done) => {
        request(app)
            .post("/bake")
            .set("Content-Type", "application/json")
            .send({input: "Testing, 1 2 3", recipe: {op: "to hex" }})
            .expect(200)
            .expect({
                value: "54 65 73 74 69 6e 67 2c 20 31 20 32 20 33",
                type: "string",
            }, done);
    });

    it("should parse a recipe in the compact JSON format taken from the CyberChef website", (done) => {
        request(app)
            .post("/bake")
            .set("Content-Type", "application/json")
            .send({input: "some input", recipe: [{"op": "To Morse Code", "args": ["Dash/Dot", "Backslash", "Comma"]}, {"op": "Hex to PEM", "args": ["SOMETHING"]}, {"op": "To Snake case", "args": [false]}]})
            .expect(200)
            .expect({
                value: "begin_something_anananaaaaak_da_aaak_da_aaaaananaaaaaaan_da_aaaaaaanan_da_aaak_end_something",
                type: "string",
            }, done);
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
            .expect({
                value: "begin_something_anananaaaaak_da_aaak_da_aaaaananaaaaaaan_da_aaaaaaanan_da_aaak_end_something",
                type: "string",
            }, done);
    });

    it("should return a useful error if we give an input/recipe combination that results in an OperationError", (done) => {
        request(app)
            .post("/bake")
            .set("Content-Type", "application/json")
            .send({
                input: "irrelevant",
                recipe: {
                    op: "AES Encrypt",
                    args: {
                        key: "notsixteencharslong"
                    }
                }
            })
            .expect(400)
            .expect("Invalid key length: 2 bytes\n\nThe following algorithms will be used based on the size of the key:\n  16 bytes = AES-128\n  24 bytes = AES-192\n  32 bytes = AES-256", done);
    });

    it("should return a string output as a byte array, if outputType is defined", (done) => {
        request(app)
            .post("/bake")
            .set("Content-Type", "application/json")
            .send({
                input: "irregular alcove",
                recipe: "to hex",
                outputType: "byte array",
            })
            .expect(200)
            .expect({
                value: [54, 57, 32, 55, 50, 32, 55, 50, 32, 54, 53, 32, 54, 55, 32, 55, 53, 32, 54, 99, 32, 54, 49, 32, 55, 50, 32, 50, 48, 32, 54, 49, 32, 54, 99, 32, 54, 51, 32, 54, 102, 32, 55, 54, 32, 54, 53],
                type: "byteArray",
            }, done);
    });

    it("should return a json output as a number, if outputType is defined", (done) => {
        request(app)
            .post("/bake")
            .set("Content-Type", "application/json")
            .send({
                input: "something oddly colourful",
                recipe: "entropy",
                outputType: "number",
            })
            .expect(200)
            .expect({
                value: 3.893660689688185,
                type: "number",
            }, done);
    });

    it("should return a useful error if returnType is given but has an invalid value", (done) => {
        request(app)
            .post("/bake")
            .set("Content-Type", "application/json")
            .send({
                input: "irregular alcove",
                recipe: "to hex",
                outputType: "some invalid type",
            })
            .expect(400)
            .expect("Invalid data type string. No matching enum.", done);
    });

});

describe("GET /bake", function() {

    it("should return 400 if recipe query is not provided", (done) => {
        request(app)
            .get("/bake?input=dGVzdGluZywgb25lLCB0d28sIHRocmVlIQ")
            .set("Accept", "application/json")
            .expect(400)
            .expect("'recipe' query parameter is required", done);
    });

    it("should return 400 if input query is not provided", (done) => {
        request(app)
            .get("/bake?recipe=To_Base64('A-Za-z0-9%2B/%3D')")
            .set("Accept", "application/json")
            .expect(400)
            .expect("'input' query parameter is required", done);
    });

    it("should accept a recipe and input from the chef-format save dialog", (done) => {
        request(app)
            .get("/bake?recipe=To_Base64('A-Za-z0-9+/=')&input=dGVzdGluZywgb25lLCB0d28sIHRocmVlIQ")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200)
            .expect({
                value: "dGVzdGluZywgb25lLCB0d28sIHRocmVlIQ==",
                type: "string",
            }, done);
    });

    it("should return JSON regardless of whether you set the Accept header", (done) => {
        request(app)
            .get("/bake?recipe=To_Base64('A-Za-z0-9+/=')&input=dGVzdGluZywgb25lLCB0d28sIHRocmVlIQ")
            .expect("Content-Type", /json/)
            .expect(200, done);
    });

    it("should accept a recipe and input from the UI deeplink", (done) => {
        request(app)
            .get("/bake?recipe=To_Base64('A-Za-z0-9%2B/%3D')&input=dGVzdGluZywgb25lLCB0d28sIHRocmVlIQ")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200)
            .expect({
                value: "dGVzdGluZywgb25lLCB0d28sIHRocmVlIQ==",
                type: "string",
            }, done);
    });

    it("should base64-encode dishes with binary value (Array buffer)", (done) => {
        request(app)
            .get("/bake?recipe=Take_bytes(0,8,false)&input=b25lLCB0d28sIHRocmVlLCBmb3Vy")
            .set("Accept", "application/json")
            .expect("Content-type", /json/)
            .expect(200)
            .expect({
                value: "b25lLCB0d28=", // base64 encoded actual value
                type: "ArrayBuffer",
            }, done);
    });

    it("should accept a recipe with multiple inputs from the UI deeplink", (done) => {
        request(app)
            .get("/bake?recipe=RC4(%7B'option':'UTF8','string':'secret'%7D,'Hex','Hex')Disassemble_x86('64','Full%20x86%20architecture',16,0,true,true)Take_bytes(-82,80,false)&input=MjFkZGQyNTQwMTYwZWU2NWZlMDc3NzEwM2YyYTM5ZmJlNWJjYjZhYTBhYWJkNDE0ZjkwYzZjYWY1MzEyNzU0YWY3NzRiNzZiM2JiY2QxOTNjYjNkZGZkYmM1YTI2NTMzYTY4NmI1OWI4ZmVkNGQzODBkNDc0NDIwMWFlYzIwNDA1MDcxMzhlMmZlMmIzOTUwNDQ2ZGIzMWQyYmM2MjliZTRkM2YyZWIwMDQzYzI5M2Q3YTVkMjk2MmMwMGZlNmRhMzAwNzJkOGM1YTZiNGZlN2Q4NTlhMDQwZWVhZjI5OTczMzYzMDJmNWEwZWMxOQ")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200)
            .expect({
                value: Buffer.from("000000000000006F C744244000000802                MOV DWORD PTR [RSP+40],02080000").toString("base64"),
                type: "ArrayBuffer",
            }, done);
    });

    it("should accept a recipe with disabled operations from the UI deeplink", (done) => {
        request(app)
            .get("/bake?recipe=Parse_IPv6_address()Take_bytes(0,5,false/disabled)Extract_IP_addresses(true,false,false,false)&input=MjAwMTowMDAwOjQxMzY6ZTM3ODo4MDAwOjYzYmY6M2ZmZjpmZGQy")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200)
            .expect({
                value: `65.54.227.120
192.0.2.45
`,
                type: "string",
            }, done);
    });

    it("should accept a recipe with disabled operations from the UI deeplink", (done) => {
        request(app)
            .get("/bake?recipe=To_Base32('A-Z2-7%3D')To_Base64('A-Za-z0-9%2B/%3D'/breakpoint)&input=ZGFuaXNoIG9pbA")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200)
            .expect({
                value: "MRQW42LTNAQG62LM",
                type: "string",
            }, done);
    });


    // TODO this one fails due to line delimiter on input probably

    // it("should accept a recipe with disabled operations from the UI deeplink", (done) => {
    //     request(app)
    //     .get("/bake?recipe=Set_Difference('%5C%5Cn%5C%5Cn',':')To_Base85('!-u',false/breakpoint)&input=MjAwMTowMDAwOjQxMzY6ZTM3OAoKODAwMDo2M2JmOjNmZmY6ZmRkMg")
    //     .set("Accept", "application/json")
    //     // .expect("Content-Type", /json/)
    //     // .expect(200)
    //     .expect({
    //         value: "2001:0000:4136:e378",
    //         type: "string",
    //     }, done);
    // });

    // TODO this one fails because first op is a breakpoint, and the input has already
    // been transformed into a dish with byte array

    // it("should accept a recipe with a breakpoint from the UI deeplink", (done) => {
    //     request(app)
    //     .get("/bake?recipe=Parse_IPv6_address(/breakpoint)Extract_IP_addresses(true,false,false,false)&input=MjAwMTowMDAwOjQxMzY6ZTM3ODo4MDAwOjYzYmY6M2ZmZjpmZGQy")
    //     .set("Accept", "application/json")
    //     .expect("Content-Type", /json/)
    //     .expect(200)
    //     .expect({
    //         value: "2001:0000:4136:e378:8000:63bf:3fff:fdd2",
    //         type: "string",
    //     }, done);

    // })

});
