FROM node:22.15.1-alpine AS builder
ENV IS_DOCKER_ENVIRONMENT=true
WORKDIR /app
RUN apk add --no-cache python3 make g++
COPY package*.json ./
RUN npm ci --ignore-scripts
COPY . ./
RUN npm rebuild node-sass || echo "node-sass rebuild skipped"

ENV NODE_OPTIONS="--expose-gc --max-old-space-size=8192"
RUN npm run build

FROM nginx:alpine
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

COPY --from=builder /app/dist /usr/share/nginx/html

COPY ./conf/default.conf /etc/nginx/conf.d/default.conf.template

ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
