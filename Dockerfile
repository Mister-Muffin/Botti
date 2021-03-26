FROM docker.io/node:lts-buster-slim

RUN npm i

CMD [ "npm", "run", "start" ]