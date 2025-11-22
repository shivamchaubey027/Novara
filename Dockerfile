FROM node:lts-alpine AS base
WORKDIR /usr/src/app

# ---- Dependencies ----
FROM base AS dependencies
COPY package.json package-lock.json* ./
RUN npm install

# ---- Build ----
FROM base AS build
COPY package.json package-lock.json* ./
# Install all dependencies, including devDependencies, for the build
RUN npm install
COPY . .
# This command assumes your package.json has a "build" script (e.g., "build": "tsc")
RUN npm run build

# ---- Release ----
FROM base AS release
ENV NODE_ENV=production
USER node

COPY --from=dependencies --chown=node:node /usr/src/app/node_modules ./node_modules
COPY --from=build --chown=node:node /usr/src/app/dist ./dist
COPY --from=build --chown=node:node /usr/src/app/package.json ./package.json

EXPOSE 5000
CMD ["npm", "start"]
