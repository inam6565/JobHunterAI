# syntax=docker/dockerfile:1.7

FROM node:22.17.1-alpine3.22 AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

FROM deps AS build
COPY tsconfig.json eslint.config.js vitest.config.ts .prettierrc.json ./
COPY src ./src
COPY test ./test
RUN npm run build

FROM node:22.17.1-alpine3.22 AS runtime
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./package.json
COPY .env.example ./.env.example

USER appuser
EXPOSE 3000

CMD ["node", "dist/index.js"]
