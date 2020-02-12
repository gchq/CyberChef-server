# CyberChef server

[![](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](https://github.com/gchq/CyberChef-server/blob/master/LICENSE)
[![Gitter](https://badges.gitter.im/gchq/CyberChef.svg)](https://gitter.im/gchq/CyberChef?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)


Run CyberChef in a server and provide an API for clients to send [Cyberchef](https://gchq.github.io/CyberChef/) recipes to bake.

## Motivation

CyberChef has a useful Node.js API, but sometimes we want to be able to programmatically run CyberChef recipes in languages other than JavaScript. By running this server, you can use CyberChef operations in any language, as long as you can communicate via HTTP.

## Example use
Assuming you've downloaded the repository and are running it locally:
```bash
curl -X POST -H "Content-Type:application/json" -d '{"input":"... ---:.-.. --- -. --. --..--:.- -. -..:- .... .- -. -.- ...:..-. --- .-.:.- .-.. .-..:- .... .:..-. .. ... ....", "recipe":{"op":"from morse code", "args": {"wordDelimiter": "Colon"}}}' localhost:3000/bake
```
response:
```
SO LONG, AND THANKS FOR ALL THE FISH
```


## Features
- **Compatible with recipes saved from CyberChef**.
After using [CyberChef](https://gchq.github.io/CyberChef/) to experiment and find a suitable recipe, the exported recipe JSON can be used to post to the `/bake` endpoint. Just copy/paste it in as your `recipe` property as part of the POST body.


## Installing
- Clone the repository
- `cd` into the project and run `npm install`
- Run `npm run`
- In a browser, navigate to `localhost:3000` to see usage documentation.


### Docker
A Docker image can be built, then run by doing the following:

- `git clone https://github.com/gchq/CyberChef-server`
- `cd Cyberchef-Server`
- `sudo docker build -t mylocalrepo/cyberchef-server .`
- `sudo docker run -dit --name=cyberchef-server -p 0.0.0.0:3000:3000 mylocalrepo/cyberchef-server`

Alternatively, docker-compose can be used to build/run an image as follows (once inside of the `Cyberchef-Server` directory after cloning):

- `sudo docker-compose up -d`

Or, a prebuilt image can be pulled (from Dockerhub) and run via the following:

- `sudo docker run -dit --name=cyberchef-server -p 0.0.0.0:3000:3000 wlambert/cyberchef-server`


## API overview
> For full documentation of the API, you can find the swagger page hosted at the root url. See [Installing](#Installing) to run the application and browse the docs.

Currently the server just has one endpoint: `/bake`. This endpoint accepts a POST request with the following body:

|Parameter|Type|Description|
|---|---|---|
input|String|The input data for the recipe. Currently accepts strings.
recipe|String or Object or Array|One or more operations, with optional arguments. Uses default arguments if they're not defined here.

#### Example: one operation, default arguments
```javascript
{
    "input": "One, two, three, four.",
    "recipe": "to decimal"
}

// response: 79 110 101 44 32 116 119 111 44 32 116 104 114 101 101 44 32 102 111 117 114 46
```
For more information on how operation names are handled, see the [Node API docs](https://github.com/gchq/CyberChef/wiki/Node-API#operation-names)


#### Example: one operation, non-default arguments by name
```javascript
{
    "input": "One, two, three, four.",
    "recipe": {
        "op": "to decimal",
        "args": {
            "delimiter": "Colon"
        }
    }
}
// response: 79:110:101:44:32:116:119:111:44:32:116:104:114:101:101:44:32:102:111:117:114:46
```

#### Example: one operation, non-default arguments by position
```javascript
{
    "input": "One, two, three, four.",
    "recipe": {
        "op": "to decimal",
        "args": ["Colon"]
    }
}
// response: 79:110:101:44:32:116:119:111:44:32:116:104:114:101:101:44:32:102:111:117:114:46
```

#### Example: all together
```javascript
{
    "input": "One, two, three, four.",
    "recipe": [
        {
            "op":"to decimal",
            "args": {
                "delimiter": "CRLF"
            }
        },
        {
            "op": "swap endianness",
            "args": ["Raw"]
        },
        "MD4"
    ]
}
// response: 31d6cfe0d16ae931b73c59d7e0c089c0
```


## Licencing

CyberChef-server is released under the [Apache 2.0 Licence](https://www.apache.org/licenses/LICENSE-2.0) and is covered by [Crown Copyright](https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/copyright-and-re-use/crown-copyright/).
