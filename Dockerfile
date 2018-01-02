FROM node:alpine
ENV GOOGLE_HOME_KODI_CONFIG="/config/kodi-hosts.config.js"
ENV NODE_ENV=production
ENV PORT=8099

VOLUME /config
WORKDIR /home/node/app

COPY package*.json ./
RUN npm install --production && npm cache clean --force
COPY . .

EXPOSE 8099
USER node
CMD ["node", "server.js"]
