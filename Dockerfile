FROM node:10

WORKDIR /usr/src/app

# Add Tini Support
ENV TINI_VERSION v0.18.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini

# Move and Install project
COPY . .
RUN npm install --production

EXPOSE 8000
ENTRYPOINT [ "/tini", "--" ]
CMD [ "node", "server" ]
