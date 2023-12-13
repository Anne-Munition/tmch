FROM node:20.10.0-alpine3.18 AS base
WORKDIR /app

FROM base AS pnpm
RUN corepack enable && corepack prepare pnpm@8.11.0 --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY sync/package.json ./sync/package.json
COPY utilities/package.json ./utilities/package.json
RUN pnpm install --frozen-lockfile

FROM pnpm AS src
COPY . .

FROM src AS utilities_builder
RUN cd /app/utilities && \
    pnpm run build

FROM utilities_builder AS sync_builder
RUN cd /app/sync && \
    pnpm run prettier && \
    pnpm run lint && \
    pnpm run build
RUN pnpm --filter="./sync" --prod deploy prod

FROM base AS sync
ENV NODE_ENV=production
COPY --from=sync_builder /app/package.json /app/package.json
COPY --from=sync_builder /app/prod/node_modules /app/node_modules
COPY --from=sync_builder /app/prod/dist /app/dist
EXPOSE 3000
ENTRYPOINT ["node", "/app/dist/index.js"]
