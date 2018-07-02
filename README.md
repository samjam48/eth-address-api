Express & ES6 REST API Boilerplate
==================================


Getting Started
---------------

```sh
# Install dependencies
npm install

# Start production server:
npm start
```


## API Endpoints

| url                      | type | inputs                                                                                                                 | returns                                                         |   |
|--------------------------|------|------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------|---|
| /api/createWallet        | GET  | -                                                                                                                      | Object containing Ethereum private key and public address pair  |   |
| /api/getBalance/:address | GET  | valid public Ethereum address                                                                                          | Object containing balance of the account in wei                 |   |
| /api/transaction         | POST | transaction object ([see below](#transaction-object)) | Object containing the transaction details                       |   |


#### Transaction Object

```
{
	"privateKey": <valid private key>,
	"destination": <valid public address>,
	"amount": <eth to send (positive number)>
}
```