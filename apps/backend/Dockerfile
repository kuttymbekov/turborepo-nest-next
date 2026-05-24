# Build context: repo root
FROM node:20-alpine
WORKDIR /app

RUN npm install -g pnpm

COPY pnpm-lock.yaml package.json pnpm-workspace.yaml turbo.json ./
COPY packages/ ./packages/
COPY apps/ ./apps/

RUN pnpm install --frozen-lockfile

WORKDIR /app/apps/backend

# Generate Prisma client
RUN node_modules/.bin/prisma generate

# Build NestJS using the locally installed CLI binary
RUN node_modules/.bin/nest build

ENV NODE_ENV=production
ENV PATH=/app/apps/backend/node_modules/.bin:$PATH
EXPOSE 3000

WORKDIR /app/apps/backend
CMD sh -c "prisma db push --accept-data-loss && prisma db seed && node dist/main"
