# Only for server deployment
# This shouldn't need changing, speak to Ashley if you think it does

# Alpine reduces image size by 10x
FROM node:10-alpine

EXPOSE 3005

COPY . /app

RUN npm --prefix /app install --only=prod

CMD npm --prefix /app start

