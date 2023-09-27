FROM alpine:edge

COPY . /botti

WORKDIR /botti

ENV DB_USER="botti" \
    DB_DB="botti" \
    DB_IP=127.0.0.1 \
    DB_PORT=5432 \
    DB_PASS="postgres"

RUN apk --no-cache add deno

# RUN deno cache --lock=bot/deno.lock bot/deno.json
# RUN deno cache --lock=backend/deno.lock backend/deno.json
RUN deno task build

CMD [ "deno", "task", "full" ]
