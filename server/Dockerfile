# Install dependencies
FROM node:8.11.1 as ubuntu

WORKDIR /src
ADD /server/package.json /src/package.json

RUN npm install --only=production

ADD server/. /src

# Copy built service into production image
FROM node:8.11.1-alpine as alpine
RUN npm install -g nodemon
COPY --from=ubuntu /src /src 

WORKDIR /src

EXPOSE 3000
CMD [ "node", "app.js" ]
