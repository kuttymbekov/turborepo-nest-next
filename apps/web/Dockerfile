# Build context: repo root
FROM node:20-alpine
WORKDIR /app

RUN npm install -g pnpm

COPY pnpm-lock.yaml package.json pnpm-workspace.yaml turbo.json ./
COPY packages/ ./packages/
COPY apps/ ./apps/

ARG NEXT_PUBLIC_API_URL=http://localhost:3000
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN pnpm install --frozen-lockfile

WORKDIR /app/apps/web

# Build Next.js using locally installed binary
RUN node_modules/.bin/next build

ENV NODE_ENV=production
ENV PORT=3001
EXPOSE 3001

CMD ["node_modules/.bin/next", "start", "-p", "3001"]
