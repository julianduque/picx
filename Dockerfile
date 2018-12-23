FROM node:10

# Add Tini Support
ENV TINI_VERSION v0.18.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini

# Move and Install project
COPY package.json /usr/src/app/
COPY picx-api/package.json /usr/src/app/picx-api/
COPY picx-config/package.json /usr/src/app/picx-config/
COPY picx-db/package.json /usr/src/app/picx-db/
COPY picx-errors/package.json /usr/src/app/picx-errors/
COPY picx-utils/package.json /usr/src/app/picx-utils/
WORKDIR /usr/src/app
RUN npm install --production
COPY . /usr/src/app/

EXPOSE 8000
ENTRYPOINT [ "/tini", "--" ]
CMD [ "node", "server" ]
