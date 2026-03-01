ARG TZ=America/Lima
ARG NODE_ENV=production

FROM oven/bun:1-slim AS builder

ARG TZ
ARG NODE_ENV

ENV TZ=${TZ}
ENV NODE_ENV=${NODE_ENV}

# Workspace packages
WORKDIR /app

# Typescript and dependencies
COPY patches/ patches/
COPY package.json bun.lock tsconfig.base.json ./
COPY database/package.json ./database/package.json
COPY shared/typescript/package.json ./shared/typescript/package.json

RUN bun install --ci

# Shared package
COPY shared/typescript/tsconfig.json ./shared/typescript/tsconfig.json
COPY shared/typescript/src/ shared/typescript/src/

# Database package
COPY database/tsconfig.json ./database/tsconfig.json
COPY database/src/ database/src/

# Auth service
WORKDIR /app/services/auth

# Typescript and dependencies
COPY services/auth/tsconfig.json services/auth/package.json ./

RUN bun install --ci

# Build
COPY services/auth/scripts/ scripts/
COPY services/auth/src/ src/

RUN bun run build


FROM gcr.io/distroless/cc AS runtime

# Add wget for ready endpoint healthcheck
COPY --from=busybox /lib/* /lib/
COPY --from=busybox /lib64/* /lib64/
COPY --from=busybox /bin/wget /bin/

WORKDIR /app

ARG TZ
ARG NODE_ENV

ENV TZ=${TZ}
ENV NODE_ENV=${NODE_ENV}
ENV HOST=0.0.0.0
ENV PORT=3000

COPY database/migration/ database/migration/

WORKDIR /app/services/auth

COPY --from=builder /app/services/auth/index ./index
COPY --from=builder /app/services/auth/index.js.map ./index.js.map
COPY --from=builder /app/services/auth/dist/ dist/

EXPOSE 3000

ENTRYPOINT [ "./index" ]

HEALTHCHECK --interval=120s --timeout=5s --start-period=5s \
  CMD ["/bin/wget", "--spider", "--timeout=5", "http://localhost:3000/_health"]
