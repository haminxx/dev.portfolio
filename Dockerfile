FROM node:22-alpine AS build
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/api/package.json packages/api/
COPY packages/web/package.json packages/web/
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:22-alpine
ENV NODE_ENV=production ENVIRONMENT=production PORT=8666
WORKDIR /app/packages/api
COPY --from=build /app/packages/api/dist ./dist
COPY --from=build /app/packages/web/build/client ../web/build/client
USER node
EXPOSE 8666
CMD ["node", "dist/index.mjs"]
