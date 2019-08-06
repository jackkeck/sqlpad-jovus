FROM node:12.3.1-alpine

ENV NODE_ENV production

WORKDIR /var/lib/sqlpad

COPY . .

RUN scripts/build.sh && \
    npm cache clean --force && \
    cp -r /var/lib/sqlpad/server /usr/app && \
    chmod +x /docker-entrypoint

ENTRYPOINT ["/docker-entrypoint"]
