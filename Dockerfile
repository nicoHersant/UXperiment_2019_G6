#pull a node image from docker hub
FROM owncloudci/nodejs

#set the working dir to /app
WORKDIR /app

#expose port 3000 to mount it to another port in local machine
EXPOSE 3000

# install package.json modules in container
COPY package.json package.json
RUN npm install
RUN npm update

#copy everything to container /app
COPY . .

# start server inside container
CMD [ "node", "app.js" ]
