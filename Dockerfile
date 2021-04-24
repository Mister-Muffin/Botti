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

CMD [ "npm", "run", "full" ]