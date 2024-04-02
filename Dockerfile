# no alpine? -> https://github.com/docker/build-push-action/issues/1071#issuecomment-1976574780
FROM docker.io/node:lts AS BUILD_IMAGE

COPY . /botti

WORKDIR /botti

ENV DB_USER="botti" \
    DB_DB="botti" \
    DB_IP=127.0.0.1 \
    DB_PORT=5432 \
    DB_PASS="postgres"

RUN npm i -g pnpm

RUN pnpm install --frozen-lockfile
RUN pnpm add concurrently
RUN pnpm build-only
RUN pnpm build-server

FROM docker.io/node:lts-alpine

# Copy built application from build phase
COPY --from=BUILD_IMAGE /botti /botti

WORKDIR /botti

CMD [ "npm", "run", "full" ]
