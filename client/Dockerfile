# Create build production env [Build Phase]
FROM node:16-alpine as builder

WORKDIR '/app'
COPY ./package.json ./
RUN npm install
COPY . .
RUN npm run build


# Create nginx server and copy result of build folder [Run Phase]
FROM nginx
EXPOSE 3000
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html
