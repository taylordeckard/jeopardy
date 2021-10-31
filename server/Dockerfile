# Install dependencies
FROM node:14 as ubuntu

WORKDIR /server
ADD ./package.json /server/package.json

RUN npm install --only=production

ADD ./src /server/src

# Copy built service into production image
FROM node:14-alpine as alpine
RUN npm install -g nodemon
COPY --from=ubuntu /server /server

WORKDIR /server

ENV NODE_ENV="production"
EXPOSE 3000
CMD [ "node", "src/app.js" ]
