# Install dependencies
FROM node:8.11.1 as ubuntu

WORKDIR /server
ADD ./package.json /server/package.json

RUN npm install --only=production

ADD ./src /server/src

# Copy built service into production image
FROM node:8.11.1-alpine as alpine
RUN npm install -g nodemon
COPY --from=ubuntu /server /server

WORKDIR /server

EXPOSE 3000
CMD [ "node", "src/app.js" ]
