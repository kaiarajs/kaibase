# Stage 1: base
FROM node:20-alpine as base

WORKDIR /app
# Stage 2
FROM base as build

# Copy everything for the build
COPY ./ /app


RUN npm install -g pnpm
RUN pnpm i
RUN pnpm run build

FROM base as release

COPY --from=build /app/dist /app/dist
COPY --from=build /app/package.json /app/package.json
RUN npm install -g pnpm @kaiarajs/kaibase-server
RUN pnpm i --prod

EXPOSE 3000
CMD ["kaibase-server", "start"]