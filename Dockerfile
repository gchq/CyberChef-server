FROM node:alpine3.10
LABEL author "Wes Lambert, wlambertts@gmail.com"
LABEL description="Dockerised version of Cyberchef server (https://github.com/gchq/CyberChef-server)"
LABEL copyright "Crown Copyright 2020"
LABEL license "Apache-2.0"
RUN apk update && apk add --no-cache --update npm && \
    npm cache clean --force && \
    apk add --no-cache git && \
    git clone https://github.com/gchq/CyberChef-server && \
    apk del git && \
    npm install /CyberChef-server
ENTRYPOINT ["/usr/bin/npm", "--prefix", "/CyberChef-server", "run", "prod"]
