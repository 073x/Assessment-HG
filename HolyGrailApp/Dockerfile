FROM node:18-alpine

ARG REDIS_HOST
ARG REDIS_PORT
ARG REDIS_PASSWORD
ARG SERVICE_ENV
ARG SERVICE_PORT

WORKDIR /opt/app

COPY ./ ./

RUN echo "REDIS_HOST="REDIS_HOST > .env
RUN echo "REDIS_PORT="REDIS_PORT > .env
RUN echo "REDIS_PASSWORD="REDIS_PASSWORD > .env
RUN echo "SERVICE_ENV="SERVICE_ENV > .env
RUN echo "SERVICE_PORT="SERVICE_PORT > .env

RUN cat .env

CMD ["npm", "run", "start"]