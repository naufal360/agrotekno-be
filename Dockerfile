FROM node:16.14
ENV NODE_ENV=production

WORKDIR /app

COPY package*.json  /app
COPY package-lock.json* /app
COPY startup.sh /app

RUN chmod +x startup.sh
RUN npm install --production
RUN npm audit fix --force

COPY . .

EXPOSE 8080

ENTRYPOINT [ "./startup.sh" ]
