FROM node:16.14
ENV NODE_ENV=production

WORKDIR /app

COPY package*.json  /app
COPY package-lock.json* /app

RUN npm install --production
RUN npm audit fix --force

COPY . .

EXPOSE 8080

CMD [ "npm", "run", "start" ]
