FROM node:8.10.0-alpine

ENV NODE_ENV=production

# To handle 'not get uid/gid'
RUN npm config set unsafe-perm true

RUN apk add --no-cache --virtual builds-deps build-base python

WORKDIR /edirectinsure

ADD / ./

RUN npm i nodemon cross-env npm-run-all node-gyp node-pre-gyp -g \
    && npm install \
    && npm rebuild bcrypt --build-from-source

# Run the container under "node" user by default
USER node

CMD ["npm", "start"]
