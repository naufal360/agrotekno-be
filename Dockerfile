FROM node:16.14
ENV NODE_ENV=production

WORKDIR /app

COPY . .

# RUN chmod +x startup.sh
RUN npm install --production
RUN npm audit fix --force

EXPOSE 8080

CMD ["npm", "run", "start"]
# ENTRYPOINT [ "./startup.sh" ]