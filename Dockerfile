FROM docker.io/node:lts-buster

COPY . /botti

WORKDIR /botti

RUN npm ci
RUN npm i -g concurrently

CMD [ "npm", "run", "full" ]