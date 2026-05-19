# 1. Use the official Node.js 18 alpine image
FROM node:18-alpine

# 2. Install FFmpeg using Alpine's package manager
RUN apk add --no-cache ffmpeg

# 3. Create app directory
WORKDIR /usr/src/app

# 4. Install app dependencies
COPY package*.json ./
RUN npm install --production

# 5. Bundle app source
COPY . .

# 6. Expose the port and start the app
EXPOSE 8080
CMD [ "node", "server.js" ]