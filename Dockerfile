FROM docker.io/node:lts-alpine

COPY . /botti

WORKDIR /botti

ENV MONGO_USER="botti" \
    MONGO_AUTH_MECHANISM="SCRAM-SHA-256" \
    MONGO_DB="botti" \
    MONGO_IP=127.0.0.1 \
    MONGO_PORT=27017

RUN npm i
RUN npm i -g concurrently
RUN apk add curl

HEALTHCHECK --interval=20s --timeout=3s --start-period=10s --retries=3 CMD curl --fail ${MONGO_IP}:${MONGO_PORT} || exit 1

CMD [ "npm", "run", "full" ]