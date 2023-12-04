FROM node:18

WORKDIR /app

COPY package.json .
# COPY ./yarn.lock ./yarn.lock

RUN yarn cache clean
RUN yarn install

COPY . .

RUN yarn build

EXPOSE 8070

CMD ["yarn", "start"]
