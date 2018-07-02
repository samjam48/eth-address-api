import { Router } from 'express';
import ethWallet from 'ethereumjs-wallet';
const Tx = require('ethereumjs-tx');
const axios = require('axios');
const Web3 = require('web3');

export default ({ config }) => {
    let api = Router();
    const web3 = new Web3( new Web3.providers.HttpProvider("https://rinkeby.infura.io/2uLY7asRwYR8AIrXRisS") );

    api.get('/', (req, res) => {
        let apiInstructions = { 
            "use": "an api for basic wallet functionalities on the ethereum network",
            "routes": {
                "/createWallet": {
                    "type": "GET",
                    "paramaters": "none",
                    "returns": {
                        "privateKey": "string",
                        "publicAddress": "string"
                    }
                },
                "/getBalance:param": {
                    "type": "GET",
                    "paramaters": "string - valid public Ethereum address",
                    "returns": {
                        "privateKey": "string",
                        "publicAddress": "string"
                    }

                },
                "/transaction": {
                    "type": "POST",
                    "paramaters": {
                        "privateKey": "string - valid private Ethereum wallet key",
                        "destination": "string - valid public Ethereum address",
                        "amount": "number - amount of Ethereum to send (unit Eth)"
                    },
                    "returns": {
                        "privateKey": "string",
                        "publicAddress": "string"
                    }

                }
            }
        }

        res.json( apiInstructions );
    });

    // Generate a new Ethereum wallet and return an object with the private key and the public ETH address
    api.get('/createWallet', (req, res) => {
        let wallet = ethWallet.generate();

        res.json({
            "privateKey": wallet.getPrivateKeyString(),
            "publicEthAddress": wallet.getAddressString()
        });
    });

    //Get the balance of an ethereum address
    api.get('/getBalance/:address', (req, res) => {
        const address = req.params.address

        if(web3.isAddress(address)){
            const balance = web3.eth.getBalance(address);
            res.json({ balance, "units": "wei" });
        }
        res.json({ "balance": "Invalid Ethereum addresss" })
    });

    // Creates a transaction to send ETH from one address to another
    api.post('/transaction', async (req, res) => {

        // add validation

        const { privateKey, destination, amount } = req.body;
        // if(web3.isAddress(destination)) console.log('address exists');

        var publicAddress   = await web3.eth.accounts.privateKeyToAccount("0x" + privateKey).address;
        let gasPrices       = await axios.get('https://ethgasstation.info/json/ethgasAPI.json');
        let nonce           = await web3.eth.getTransactionCount(publicAddress);
        let txValue         = web3.utils.toHex( web3.utils.toWei(amount, 'ether') );

        let rawTx  = {
                "from": publicAddress,
                "to": destination,
                "value": txValue,
                "gasPrice": gasPrices.data.safeLow * 100000000,
                "nonce": nonce,
                "chainId": 4    // EIP 155 chainId - mainnet: 1, rinkeby: 4
            }
        rawTx.gas  = await web3.eth.estimateGas(rawTx)
        web3.eth.defaultAccount = publicAddress;

        const tx            = new Tx(rawTx);
        tx.sign( new Buffer(privateKey, 'hex') );
        const serializedTx  = tx.serialize();
        console.log('serializedTx', serializedTx);

        const txDetails = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));

        const url = `https://rinkeby.etherscan.io/tx/${txDetails.transactionHash}`
        console.log("success - url is here - ", url);
        res.json(txDetails);
    })

    return api;
}
