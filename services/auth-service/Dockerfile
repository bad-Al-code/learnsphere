FROM node:lts-alpine3.21 AS dependencies
RUN npm install -g pnpm@10.11.1
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM dependencies AS builder
COPY . .
RUN pnpm run build

FROM node:lts-alpine3.21 AS production
ENV NODE_ENV=production
WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN npm install -g pnpm@10.11.1
COPY --chown=appuser:appgroup package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile
COPY --chown=appuser:appgroup --from=builder /app/dist ./dist

USER appuser

EXPOSE 3000

CMD [ "node", "./dist/index.js" ]