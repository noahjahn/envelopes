FROM node:18-alpine as build

ARG VERSION=development

USER root

RUN mkdir -p /home/node/app && chown -R node:node /home/node/app

USER node

WORKDIR /home/node/app

COPY --chown=node:node package.json package-lock.json /home/node/app/
RUN npm install

COPY --chown=node:node public /home/node/app/public
COPY --chown=node:node src /home/node/app/src
COPY --chown=node:node .eslintignore /home/node/app/
COPY --chown=node:node .eslintrc.js /home/node/app/
COPY --chown=node:node .prettierrc /home/node/app/
COPY --chown=node:node index.html /home/node/app/
COPY --chown=node:node tsconfig.json /home/node/app/
COPY --chown=node:node postcss.config.js /home/node/app/
COPY --chown=node:node quasar.config.js /home/node/app/

RUN VERSION=${VERSION} npx quasar build

FROM node:16-alpine

USER root

RUN mkdir -p /home/node/app && chown -R node:node /home/node/app

RUN npm install -g @quasar/cli

USER node

COPY --from=build --chown=node:node /home/node/app/dist/ssr /home/node/app

WORKDIR /home/node/app

ENTRYPOINT [ "quasar" ]

CMD [ "serve", "--history", "." ]
