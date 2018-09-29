# Install dependencies
FROM node:8.11.1 as ubuntu

WORKDIR /server
ADD ./package.json /server/package.json

RUN npm install --only=production

ADD ./src /server/src

# Copy built service into production image
RUN npm install -g nodemon

WORKDIR /server

EXPOSE 3000
CMD [ "node", "src/app.js" ]
