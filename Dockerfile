FROM docker.io/node:lts-buster-slim

COPY * /

RUN npm i

CMD [ "npm", "run", "start" ]