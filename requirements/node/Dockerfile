# BUILD FOR LOCAL DEVELOPMENT
FROM node:16-alpine3.15 AS development
ENV TZ Europe/Moscow
STOPSIGNAL SIGKILL
WORKDIR /app
COPY --chown=node:node package*.json ./
RUN npm ci
COPY --chown=node:node . .
USER node

# BUILD FOR PRODUCTION
FROM node:16-alpine3.15 AS build
ENV TZ Europe/Moscow
ENV NODE_ENV production
STOPSIGNAL SIGKILL
WORKDIR /app
COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=development /app/node_modules ./node_modules
COPY --chown=node:node . .
RUN npm run build
RUN npm ci --only=production && npm cache clean --force
USER node

# PRODUCTION
FROM node:16-alpine3.15 AS production
ENV TZ Europe/Moscow
ENV NODE_ENV production
STOPSIGNAL SIGKILL
COPY --chown=node:node --from=build /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/dist ./dist
CMD [ "node", "dist/main.js" ]
