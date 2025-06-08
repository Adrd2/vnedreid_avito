
FROM node:20 AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM nginx:1.26-alpine AS runtime

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist /usr/share/nginx/html/vnedraid-frontend

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
