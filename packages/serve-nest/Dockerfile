FROM node:18.0-alpine3.14 AS build-stage

WORKDIR /app

COPY package.json .

RUN npm config set registry https://registry.npmmirror.com/

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

# production stage
FROM node:18.20.6-alpine3.21 AS production-stage

COPY --from=build-stage /app/dist /app/dist
COPY --from=build-stage /app/package.json /app/package.json
COPY --from=build-stage /app/.env.prod /app/.env.prod

WORKDIR /app

# 环境变量
ENV NODE_ENV production

RUN npm config set registry https://registry.npmmirror.com/

RUN npm install --only=production

EXPOSE 3000

CMD ["npm", "run", "prod"]
