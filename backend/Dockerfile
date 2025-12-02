FROM node:16-alpine AS builder
WORKDIR /app
COPY ./package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:16-alpine AS production
WORKDIR /app
COPY --from=builder /app/package*.json ./
RUN npm install -g pm2
RUN npm ci --prod
COPY --from=builder /app/dist ./dist/
EXPOSE 3000

ENTRYPOINT [ "pm2-runtime" ]
CMD ["ecosystem.config.js"]
