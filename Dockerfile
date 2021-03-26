FROM docker.io/node:lts-buster-slim

WORKDIR /Botti

RUN npm i

CMD [ "npm", "run", "start" ]