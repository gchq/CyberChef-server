// Configure swagger, which uses swagger-jsdoc.
// See https://github.com/Surnet/swagger-jsdoc/blob/master/docs/GETTING-STARTED.md
export default {
    definition: {
        // openapi: "3.0.0",
        info: {
            title: "Hello World",
            version: "1.0.0"
          }
    },
    apis: [
        "./routes/*.js"
    ]
}