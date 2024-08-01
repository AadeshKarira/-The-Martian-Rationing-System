FROM node:18
LABEL maintainer="aadesh k"
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY . .
CMD ["node", "index.js"]
