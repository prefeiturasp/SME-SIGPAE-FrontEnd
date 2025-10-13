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
RUN addgroup -g 1001 -S nginxgroup && \
    adduser -S nginxuser -u 1001 -G nginxgroup
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh
COPY --from=builder /app/dist /usr/share/nginx/html
COPY ./conf/default.conf /etc/nginx/conf.d/default.conf.template
RUN chown -R nginxuser:nginxgroup /var/cache/nginx && \
    chown -R nginxuser:nginxgroup /var/log/nginx && \
    chown -R nginxuser:nginxgroup /etc/nginx/conf.d && \
    chown -R nginxuser:nginxgroup /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html && \
    touch /var/run/nginx.pid && \
    chown -R nginxuser:nginxgroup /var/run/nginx.pid
USER nginxuser

ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
