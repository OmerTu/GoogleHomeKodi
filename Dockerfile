#### Step 1 ####
FROM node:alpine as linter

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run lint

#### Step 2 ####
FROM node:alpine as production-builder

COPY package*.json ./
RUN npm install --production

#### Step 3 ####
FROM node:alpine as app

ENV GOOGLE_HOME_KODI_CONFIG="/config/kodi-hosts.config.js"
ENV NODE_ENV=production
ENV PORT=8099

VOLUME /config
WORKDIR /home/node/app

RUN apk add --no-cache tini
COPY --from=production-builder node_modules ./node_modules
COPY . .

USER node
EXPOSE 8099
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "server.js"]