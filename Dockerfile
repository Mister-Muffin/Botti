FROM docker.io/node:lts-buster-slim

COPY . /botti

WORKDIR /botti

RUN npm i

CMD [ "npm", "run", "start" ]