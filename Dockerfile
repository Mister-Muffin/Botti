FROM docker.io/node:lts-alpine

COPY . /botti

WORKDIR /botti

ENV MONGO_USER="botti" \
    MONGO_AUTH_MECHANISM="SCRAM-SHA-256" \
    MONGO_DB="botti" \
    MONGO_IP=127.0.0.1

RUN npm i \
    npm i -g concurrently \
    apk add curl

HEALTHCHECK --interval=20s --timeout=3s --start-period=10s --retries=3 CMD curl --fail ${MONGO_IP} || exit 1

CMD [ "npm", "run", "full" ]