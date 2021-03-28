FROM docker.io/node:lts-alpine

COPY . /botti

WORKDIR /botti

ENV MONGO_USER="botti" \
    MONGO_AUTH_MECHANISM="SCRAM-SHA-256" \
    MONGO_DB="botti"

RUN npm i
RUN npm i -g concurrently

CMD [ "npm", "run", "full" ]