FROM node:24-alpine AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

COPY pnpm-lock.yaml .
COPY package.json .

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

# Build Production Image
FROM node:24-alpine AS runner

WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY pnpm-lock.yaml .
COPY package.json .

ENV NODE_ENV="production"

RUN pnpm install --frozen-lockfile

COPY --from=builder /app/dist ./dist

RUN chown -R node:node /app
RUN chmod -R 755 /app

RUN pnpm add -g pm2

COPY ecosystem.config.js .

USER node

EXPOSE 8080

CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]
