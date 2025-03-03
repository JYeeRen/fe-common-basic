# 基础镜像
FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable pnpm
RUN COREPACK_INTEGRITY_KEYS=0 corepack prepare pnpm@8.10.2 --activate

# 依赖拉取
FROM base AS prod-fetch
WORKDIR /app
COPY pnpm-lock.yaml .
RUN pnpm fetch

# 全依赖安装
FROM prod-fetch AS prod-deps
COPY package.json .
RUN pnpm install --frozen-lockfile

# 构建
FROM prod-deps AS prod
COPY --from=prod-deps /app/node_modules /app/node_modules
WORKDIR /app
COPY . .

RUN echo "VITE_COMMIT_HASH=$(git rev-parse HEAD)" >> .env
RUN echo "VITE_COMMIT_MSG=$(git log -1 --pretty=%B)" >> .env

ARG BUILD_MODE
ARG BACKEND_HOST
ARG WATERMARK_CONTENT
ARG OSS_PREFIX

ENV BUILD_MODE=${BUILD_MODE}
ENV BACKEND_HOST=${BACKEND_HOST}
ENV WATERMARK_CONTENT=${WATERMARK_CONTENT}
ENV OSS_PREFIX=${OSS_PREFIX}

RUN if [ "$BUILD_MODE" = "prd" ]; then pnpm run prd; else pnpm run uat; fi

# 运行
FROM nginx:1.27-alpine
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

RUN mkdir -p /run/nginx && \
    rm -f /etc/nginx/sites-enabled/* && \
    mkdir -p /usr/share/nginx/html

COPY --from=prod /app/dist /usr/share/nginx/html/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]