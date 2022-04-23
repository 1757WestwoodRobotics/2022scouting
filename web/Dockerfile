FROM node:16-alpine

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn

COPY . .

RUN yarn build

ENV PORT=8080

EXPOSE 8080

CMD ["node", "__sapper__/build"]
