FROM node:20.10.0-alpine3.18 AS base
WORKDIR /app

FROM base AS pnpm
RUN corepack enable && corepack prepare pnpm@8.11.0 --activate
COPY . .
RUN pnpm install --frozen-lockfile

FROM pnpm AS distributed_builder
RUN cd /app/distributed && \
    pnpm run prettier && \
    pnpm run lint && \
    pnpm run build
RUN pnpm --filter="./distributed" --prod deploy prod

FROM base AS distributed
COPY --from=distributed_builder /app/prod/dist /app/dist
COPY --from=distributed_builder /app/prod/node_modules /app/node_modules
EXPOSE 3000
ENTRYPOINT ["node", "/app/dist/index.js"]
