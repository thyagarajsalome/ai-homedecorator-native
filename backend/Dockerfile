# 1. Use the official Node.js image
FROM node:18-slim

# 2. Install FFmpeg (THIS IS WHERE THE COMMAND GOES)
RUN apt-get update && apt-get install -y ffmpeg

# 3. Create app directory
WORKDIR /usr/src/app

# 4. Install app dependencies
COPY package*.json ./
RUN npm install

# 5. Bundle app source
COPY . .

# 6. Expose the port and start the app
EXPOSE 8080
CMD [ "node", "server.js" ]