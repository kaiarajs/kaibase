# Stage 1: base
FROM node:16-alpine as base

WORKDIR /app
# Stage 2
FROM base as build

# Copy everything for the build
COPY ./ /app


RUN npm install -g pnpm
RUN pnpm i
RUN pnpm run build

FROM base as release

COPY --from=build /app/dist /app
RUN pnpm i --prod

EXPOSE 3000
CMD ["kaibase", "start"]