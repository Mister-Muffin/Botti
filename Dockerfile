FROM docker.io/node:lts-buster-slim

ADD * /

RUN npm i

CMD [ "npm", "run", "start" ]