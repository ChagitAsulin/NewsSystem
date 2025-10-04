
FROM node:20-alpine
WORKDIR /app
COPY package.json tsconfig.json next.config.mjs ./
RUN npm install
COPY src ./src
COPY public ./public
EXPOSE 3000
CMD ["npm","run","dev"]
