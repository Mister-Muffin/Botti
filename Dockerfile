FROM docker.io/node:lts-alpine

COPY . /botti

WORKDIR /botti

ENV DB_USER="botti" \
    DB_DB="botti" \
    DB_IP=127.0.0.1 \
    DB_PORT=5432 \
    DB_PASS="postgres"

RUN apk add curl
RUN curl -sL https://unpkg.com/@pnpm/self-installer | node
RUN pnpm i
RUN pnpm add concurrently

CMD [ "npm", "run", "full" ]