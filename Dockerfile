FROM node:alpine
ENV GOOGLE_HOME_KODI_CONFIG="/config/kodi-hosts.config.js"
ENV NODE_ENV=production
ENV PORT=8099

VOLUME /config
WORKDIR /home/node
USER NODE

COPY package*.json ./
RUN npm install --production && npm cache clean --force
COPY . .

EXPOSE 8099
CMD ["npm", "start"]
