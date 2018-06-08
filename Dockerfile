FROM node:8

WORKDIR /usr/src/app

# Add support for dumb-init
RUN wget -O /usr/local/bin/dumb-init https://github.com/Yelp/dumb-init/releases/download/v1.2.1/dumb-init_1.2.1_amd64
RUN chmod +x /usr/local/bin/dumb-init

COPY . .
RUN npm install

EXPOSE 8000
ENTRYPOINT ["/usr/local/bin/dumb-init", "--", "npm", "start"]
