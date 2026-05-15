# Multi-stage build

# build stage
FROM node:24 as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .
RUN npm run build

# nginx stage
FROM nginx:latest
COPY --from=build /app/dist /usr/share/nginx/html