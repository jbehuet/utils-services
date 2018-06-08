FROM node:alpine

ADD . /var/www/html

WORKDIR /var/www/html

RUN npm install

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
