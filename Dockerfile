FROM node:alpine
ENV GOOGLE_HOME_KODI_CONFIG="/config/kodi-hosts.config.js"
ENV NODE_ENV=production

VOLUME /config
WORKDIR /app

COPY package*.json ./
RUN npm install --production
COPY . .

EXPOSE 8099
CMD ["npm", "start"]
