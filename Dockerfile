FROM node:19-alpine as first-stage
EXPOSE 3000
COPY package*.json
RUN npm install
COPY . .

FROM first-stage AS final
RUN npm install --production
COPY . .
CMD ["node", "server.js"]
