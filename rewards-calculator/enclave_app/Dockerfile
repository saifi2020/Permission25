# A Dockerfile which encapsulates the calculation of rewards to be run in a secure environment

ARG NODE_VERSION=22.16.0

FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /usr/src/app
EXPOSE 3000

FROM base AS dev
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --include=dev
COPY . .
CMD ["npm", "run", "dev"]

# Update dependencies and docker log package lock
# docker compose logs --no-log-prefix > package-lock.json
FROM base AS update
COPY . .
COPY package.json .
RUN npm install --include=dev
CMD ["cat", "package-lock.json"]