FROM node:latest

COPY . .

RUN pnpm install

CMD pnpm dev