FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .
COPY env.example .env

RUN npm run build

EXPOSE 3000

ENV HOST=0.0.0.0

CMD [ "npm", "run", "dev", "--", "--host"]