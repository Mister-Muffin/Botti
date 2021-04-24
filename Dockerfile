FROM docker.io/node:lts-alpine

COPY . /botti

WORKDIR /botti

ENV DB_USER="botti" \
    DB_DB="botti" \
    DB_IP=127.0.0.1 \
    DB_PORT=5432

RUN npm i
RUN npm i -g concurrently
RUN apk add curl

HEALTHCHECK --interval=20s --timeout=3s --start-period=10s --retries=3 CMD curl --fail $DB_IP:$DB_PORT || exit 1

CMD [ "npm", "run", "full" ]