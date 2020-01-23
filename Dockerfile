FROM alpine:3.10
LABEL maintainer "Wes Lambert, wlambertts@gmail.com"
LABEL version="CyberChef server 0.0.1"
LABEL description="Dockerized version of Cyberchef server (from the fine folks at GCHQ: https://github.com/gchq/CyberChef-server)"
RUN apk update && apk add --no-cache nodejs nodejs-npm && \
    npm cache clean --force && \
    apk add --no-cache git && \
    git clone https://github.com/gchq/CyberChef-server && \
    apk del git && \
    npm install /CyberChef-server && \
    cd CyberChef-server
ENTRYPOINT ["/usr/bin/npm", "--prefix", "/CyberChef-server", "run", "prod"]
