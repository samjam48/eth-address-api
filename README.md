Express & ES6 REST API Boilerplate
==================================

- ES6 support via [babel](https://babeljs.io)
- REST resources as middleware via [resource-router-middleware](https://github.com/developit/resource-router-middleware)

Getting Started
---------------

```sh

# Start development live-reload server
PORT=8080 npm run dev

# Start production server:
PORT=8080 npm start
```
Docker Support
------
```sh
cd express-es6-rest-api

# Build your docker
docker build -t es6/api-service .
#            ^      ^           ^
#          tag  tag name      Dockerfile location

# run your docker
docker run -p 8080:8080 es6/api-service
#                 ^            ^
#          bind the port    container tag
#          to your host
#          machine port   

```

# Challenge

## The API should have 3 routes:

• GET /createWallet Generates a new Ethereum wallet and return and object with the private key and the public ETH address
• GET /getBalance/:param Get the balance of an ethereum address
• POST /transaction {privateKey, destination, amount} Creates a transaction to send ETH from one address to another. It can receive 3 raw JSON params: privateKey of the source ETH address, destination is the ETH destination address and amount the number of ETH to be send.

The project has to be pushed to Github and can be run just by cloning the repo, npm install and npm start so make sure all your dependencies are in your package.json

#### Tasks

- Build tests for each operation
- Build each operation
- clean up code
    - clean out DB files
    - clean out console logs
    - make README
    - get someone to check code seems good
- make it work when you download. npm install. npm start