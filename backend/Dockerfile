FROM node:alpine as base
WORKDIR /home/node/app/backend
COPY package*.json ./
RUN yarn
COPY . .

FROM base as production
# ENV NODE_PATH=./dist
RUN yarn build
