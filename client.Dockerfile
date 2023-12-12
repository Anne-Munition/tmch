FROM node:20.10.0-alpine3.18 AS base
WORKDIR /app

FROM base AS pnpm
RUN corepack enable && corepack prepare pnpm@8.11.0 --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY client/package.json ./client/package.json
COPY ./packages/ ./packages/
RUN pnpm install --frozen-lockfile

FROM pnpm AS src
COPY . .

FROM src AS client_builder
RUN cd /app/client && \
    pnpm run prettier && \
    pnpm run lint && \
    pnpm run build
RUN pnpm --filter="./client" --prod deploy prod

FROM base AS client
ENV NODE_ENV=production
COPY --from=client_builder /app/package.json /app/package.json
COPY --from=client_builder /app/prod/node_modules /app/node_modules
COPY --from=client_builder /app/prod/dist /app/dist
EXPOSE 3000
ENTRYPOINT ["node", "/app/dist/index.js"]
