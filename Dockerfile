FROM node:10

# Add User picx
RUN groupadd -g 999 picx && useradd -r -u 999 -g picx picx

WORKDIR /usr/src/app
RUN chown -R picx:picx /usr/src/app

# Add Tini Support
ENV TINI_VERSION v0.18.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chown -R picx:picx /tini
RUN chmod +x /tini

# Move and Install project
COPY . .
RUN npm install --production

# User
USER picx

EXPOSE 8000
ENTRYPOINT [ "/tini", "--" ]
CMD [ "node", "server" ]
