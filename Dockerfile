#pull a node image from docker hub
FROM owncloudci/nodejs

#set the working dir to /app
WORKDIR /app

#expose port 3000 to mount it to another port in local machine
EXPOSE 3000

#copy everything to container /app
COPY . .

# install package.json modules in container
RUN npm install

# install nodemon for changes on the fly
RUN npm install -g nodemon
RUN npm update

# start server inside container
CMD [ "nodemon", "index.js" ]
