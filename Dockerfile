FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . . 

# RUN npm run build

CMD ["npm", "run","dev", "-H 0.0.0.0"]

EXPOSE 3000