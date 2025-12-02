FROM node:16-alpine AS builder
WORKDIR /app
COPY ./package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:16-alpine AS production
WORKDIR /app
RUN npm install -g pm2
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/ecosystem.config.js ./
EXPOSE 3001

ENTRYPOINT [ "pm2-runtime" ]
CMD ["ecosystem.config.js"]
