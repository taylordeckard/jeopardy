from postgres:latest

ENV POSTGRES_USER jeopardy
ENV POSTGRES_PASSWORD trebek4prez2020
ENV POSTGRES_DB jeopardy

ADD ./postgres/setup /docker-entrypoint-initdb.d
