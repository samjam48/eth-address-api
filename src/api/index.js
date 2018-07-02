import { apiInstructions, balanceSchema, validateAddress, txSchema } from '../lib/util';
import axios from 'axios';
import 'babel-polyfill';
import EthereumTx from 'ethereumjs-tx';
import { Router } from 'express';
import { default as Web3 } from 'web3';
import validate from 'express-validation';

export default ({ config }) => {
    let api = Router();
    const web3 = new Web3( new Web3.providers.HttpProvider("https://rinkeby.infura.io/") );

    api.get('/', (req, res) => {
        res.json( apiInstructions );
    });

    // Generate a new Ethereum wallet and return an object with the private key and the public ETH address
    api.get('/createWallet', (req, res) => {
        let wallet = web3.eth.accounts.create();
        res.json(wallet);
    });

    //Get the balance of an ethereum address
    api.get('/getBalance/:address', validate(balanceSchema), async (req, res) => {
        const address = validateAddress(req.params.address);

        const balance = await web3.eth.getBalance(address);
        res.json({ balance, "units": "wei" });
    });

    // Creates a transaction to send ETH from one address to another
    api.post('/transaction', validate(txSchema), async (req, res, next) => {
        const { privateKey, destination, amount } = req.body;
        const privateKeyBuffer   = new Buffer(privateKey, 'hex');
        const destinationAddress = validateAddress(destination);

        const publicAddress      = await web3.eth.accounts.privateKeyToAccount("0x" + privateKey).address;
        const gasPrices          = await axios.get('https://ethgasstation.info/json/ethgasAPI.json');
        const nonce              = await web3.eth.getTransactionCount(publicAddress);
        const txValue            = web3.utils.toHex( web3.utils.toWei(amount.toString(), 'ether') );

        let rawTx  = {
                "to": destinationAddress,
                "value": txValue,
                "gasPrice": gasPrices.data.safeLow * 100000000,
                "nonce": nonce,
                "chainId": 4    // EIP 155 chainId - mainnet: 1, rinkeby: 4
            }
        rawTx.gas                = await web3.eth.estimateGas(rawTx)
        web3.eth.defaultAccount  = publicAddress;

        const tx                 = new EthereumTx(rawTx);
        tx.sign( privateKeyBuffer );
        const serializedTx       = tx.serialize();
        const txDetails          = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
        res.json(txDetails);
    });

    return api;
}
