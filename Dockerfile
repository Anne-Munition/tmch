FROM node:20.10.0-alpine3.18 AS base
WORKDIR /app

FROM base AS pnpm
RUN corepack enable && corepack prepare pnpm@8.11.0 --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY distributed/package.json ./distributed/package.json
RUN pnpm install --frozen-lockfile

FROM pnpm AS src
COPY . .

FROM src AS distributed_builder
RUN cd /app/distributed && \
    pnpm run prettier && \
    pnpm run lint && \
    pnpm run build
RUN pnpm --filter="./distributed" --prod deploy prod

FROM base AS distributed
COPY --from=distributed_builder /app/package.json /app/package.json
COPY --from=distributed_builder /app/prod/node_modules /app/node_modules
COPY --from=distributed_builder /app/prod/dist /app/dist
EXPOSE 3000
ENTRYPOINT ["node", "/app/dist/index.js"]
