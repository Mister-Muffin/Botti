FROM docker.io/node:lts-alpine

COPY . /botti

WORKDIR /botti

RUN npm i
RUN npm i -g concurrently

CMD [ "npm", "run", "full" ]