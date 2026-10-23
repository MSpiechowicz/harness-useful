# syntax=docker/dockerfile:1

# Resolved 2026-10-23 with `docker buildx imagetools inspect`:
#   oven/bun:1.4.2                          index sha256:9114c058aeae42162ee16dd5084b95fe9473970bb6bcb5b232ab1630f0546895
#   nginxinc/nginx-unprivileged:1.31-alpine  index sha256:b5047b9b76845eac124358373c6852377c52e4b05834a47647e955dd91cb8f1e

# ---- build: prerender the static site and generate the hash-based CSP ----
FROM oven/bun:1.4.2@sha256:9114c058aeae42162ee16dd5084b95fe9473970bb6bcb5b232ab1630f0546895 AS build

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

# The build script prerenders the site (rendering OG images with src/lib/seo/fonts/*.ttf) and runs gen-csp.
RUN bun run build

# nginx only serves the .gz files (gzip_static), so the Brotli copies would be dead weight.
RUN find build -name '*.br' -delete

# ---- runtime: nginx serving the static build, non-root (uid 101) ----
FROM nginxinc/nginx-unprivileged:1.31-alpine@sha256:b5047b9b76845eac124358373c6852377c52e4b05834a47647e955dd91cb8f1e

ARG VERSION=dev
ARG REVISION=unknown
ARG CREATED=unknown

LABEL org.opencontainers.image.title="harness-useful" \
      org.opencontainers.image.description="harness-useful.com: the static website for the Harness Useful family of tools" \
      org.opencontainers.image.source="https://github.com/MSpiechowicz/harness-useful" \
      org.opencontainers.image.licenses="GPL-3.0-or-later" \
      org.opencontainers.image.version="${VERSION}" \
      org.opencontainers.image.revision="${REVISION}" \
      org.opencontainers.image.created="${CREATED}"

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/headers.conf /etc/nginx/snippets/headers.conf
COPY --from=build /app/.generated/csp.conf /etc/nginx/snippets/csp.conf
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s CMD wget -q --spider http://127.0.0.1:8080/healthz || exit 1

USER 101
