FROM node:22.15.1-alpine AS builder
ENV IS_DOCKER_ENVIRONMENT=true
WORKDIR /app
RUN apk add --no-cache python3 make g++
COPY package*.json ./
RUN npm install
COPY . ./
RUN npm rebuild node-sass
RUN npm run build --expose-gc --max-old-space-size=8192

FROM nginx:alpine
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

COPY --from=builder /app/dist /usr/share/nginx/html

COPY ./conf/default.conf /etc/nginx/conf.d/default.conf.template

ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
