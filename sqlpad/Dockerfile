FROM node:12.3.1-alpine

ENV NODE_ENV production
WORKDIR /var/lib/sqlpad
COPY . .

RUN scripts/build.sh
RUN npm cache clean --force
RUN cp -r /var/lib/sqlpad/server /usr/app
RUN cp /var/lib/sqlpad/docker-entrypoint /docker-entrypoint
RUN chmod +x /docker-entrypoint

EXPOSE 3000
ENTRYPOINT ["/docker-entrypoint"]
