FROM node:16-alpine

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn

COPY . .

RUN yarn build

EXPOSE 1757

ENV NODE_ENV=production
CMD ["node", "dist/index.js"]
