FROM node:18.0-alpine3.14 AS build-stage

WORKDIR /app

COPY package.json .

RUN npm config set registry https://registry.npmmirror.com/

RUN npm install --force

COPY . .

RUN npm run build

# production stage
FROM node:18.20.6-alpine3.21 AS production-stage

COPY --from=build-stage /app/dist /app/dist
COPY --from=build-stage /app/package.json /app/package.json
COPY --from=build-stage /app/.env.prod /app/.env.prod
COPY --from=build-stage /app/ecosystem.config.js /app/ecosystem.config.js

WORKDIR /app

# 环境变量
ENV NODE_ENV production

RUN npm config set registry https://registry.npmmirror.com/

RUN npm install --only=production --legacy-peer-deps

EXPOSE 3000

CMD ["npm", "run", "prod"]
