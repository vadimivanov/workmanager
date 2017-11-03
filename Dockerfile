FROM ubuntu:latest
MAINTAINER Artem Polesskiy <polesskiy.dev@gmail.com>

# Variables
ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION 8.2.1

RUN apt-get update && apt-get install -y locales && rm -rf /var/lib/apt/lists/* \
	&& localedef -i en_US -c -f UTF-8 -A /usr/share/locale/locale.alias en_US.UTF-8
ENV LANG en_US.utf8

# Replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# Default system config
RUN \
    apt-get update && \
    apt-get --yes install \
            vim \
            curl \
            git && \
    rm -rf /var/lib/apt/lists/*

# Install nodejs && npm
# Install nvm with node and npm
RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.26.0/install.sh | bash \
    && source $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

# Set up our PATH correctly so we don't have to long-reference npm, node, &c.
ENV NODE_PATH $NVM_DIR/versions/node/v$NODE_VERSION/lib/node_modules
ENV PATH      $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

RUN node -v
RUN npm -v

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Copy source files
COPY . /usr/src/app/
RUN ls -al --full-time server/public
# Install app dependencies
RUN npm install

EXPOSE 3000
CMD [ "npm", "start" ]
