require('dotenv').config();

const Web3 = require('web3');
const axios = require('axios');
const EthereumTx = require('ethereumjs-tx');
const log = require('ololog').configure({ time: true });
const ansi = require('ansicolor').nice;

// network configuration
const testnet = `https://rinkeby.infura.io/${process.env.INFURA_ACCESS_TOKEN}`;
const web3 = new Web3( new Web3.providers.HttpProvider(testnet) );

// set the web3 default account to use wallet public address
web3.eth.defaultAccount = process.env.WALLET_ADDRESS;

// set the amount of ETH to send
const amountToSend = 0.001;

const getCurrentGasPrices = async () => {
    let response = await axios.get('https://ethgasstation.info/json/ethgasAPI.json');
    let prices = {
        low: response.data.safeLow / 10,
        medium: response.data.average / 10,
        high: response.data.fast / 10
    }

    console.log("\r\n");
    log (`Current ETH Gas Prices (in GWEI):`.cyan);
    console.log("\r\n");
    log(`Low: ${prices.low} (transaction completes in < 30 minutes)`.green);
    log(`Standard: ${prices.medium} (transaction completes in < 5 minutes)`.yellow);
    log(`Fast: ${prices.high} (transaction completes in < 2 minutes)`.red);
    console.log("\r\n");

    return prices;
}

const main = async () => {
    let myBalanceWei = web3.eth.getBalance(web3.eth.defaultAccount).toNumber();
    let myBalanceEth = web3.fromWei(myBalanceWei, 'ether');

    log(`Your wallet balance is currently ${myBalanceEth} ETH`.green);

    let nonce = web3.eth.getTransactionCount(web3.eth.defaultAccount);
    log(`The outgoing transaction count for your wallet address is: ${nonce}`.maenta);

    let gasPrices = await getCurrentGasPrices();

    // build new transaction object and sign it locally
    let details = {
        "to": process.env.DESTINATION_WALLET_ADDRESS,
        "value": web3.toHex( web3.toWei(amountToSend, 'ether') ),
        "gas": 50000,
        "gasPrice": gasPrices.low * 1000000000,
        "nonce": nonce,
        "chainId": 4 // EIP 155 chainId - mainnet: 1, rinkeby: 4
    }

    const transaction = new EthereumTx(details);

    //authorise transaction
    transaction.sign( Buffer.from(process.env.WALLET_PRIVATE_KEY, 'hex') );

    // compress transaction info into a transportable object
    const serializedTransaction = transaction.serialize();

    // submit raw transaction to provider
    const transactionId = web3.eth.sendRawTransaction('0x' + serializedTransaction.toString('hex') );

    // build public etherscan url to view the transaction details
    const url = `https://rinkeby.etherscan.io/tx/${transactionId}`
    log(url.cyan);

    log(`Note: please allow for 30 seconds before transaction appears on Etherscan`.magenta);

    process.exit();

}
main()





    // // Creates a transaction to send ETH from one address to another
    // api.post('/transaction', async (req, res) => {
    //     const { privateKey, destination, amount } = req.body;
    //     var wallet = await web3.eth.accounts.privateKeyToAccount(privateKey);
    //     web3.eth.defaultAccount = "0xfBed92E6d4112d395d374FA6DdEFDAC18D1b5A85";
    //     let nonce = await web3.eth.getTransactionCount("0xfBed92E6d4112d395d374FA6DdEFDAC18D1b5A85");
    //     let gasPrices = await axios.get('https://ethgasstation.info/json/ethgasAPI.json');
    //     let txValue = web3.utils.toHex( web3.utils.toWei(amount, 'ether') );

    //     let transactionDetails = {
    //             "to": destination,
    //             "value": txValue,
    //             "gas": 50000,
    //             "gasPrice": gasPrices.data.safeLow * 100000000,
    //             "nonce": nonce,
    //             "chainId": 4    // EIP 155 chainId - mainnet: 1, rinkeby: 4
    //         }
    //     transactionDetails.gas = await web3.eth.estimateGas(transactionDetails)

    //     var privateK = new Buffer(privateKey, 'hex')
    //     var tx = new Tx(transactionDetails);
    //     tx.sign(privateK);
    //     var serializedTx = tx.serialize();
    //     console.log('serializedTx', serializedTx);

    //     const transactionId = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));

    //     const url = `https://rinkeby.etherscan.io/tx/${transactionId}`

    //     console.log("success - url is here - ", url);
    //     res.json(transactionId);
    // })

// -----------------------------------

                // insufficient funds
        // var signedTx    = await wallet.signTransaction(transactionDetails)
        // var receipt     = await web3.eth.sendSignedTransaction(signedTx.rawTransaction)

         // invalid JSON
        // var signedTx    = await web3.eth.signTransaction(transactionDetails);
        // var receipt     = await  web3.eth.sendSignedTransaction(signedTx.raw);
        // var receipt    = await web3.eth.signTransaction(transactionDetails, function(err, signed){
        //     console.log("signTransaction err: "+err);
        //     console.log("signTransaction signed: "+signed);
        //     web3.eth.sendSignedTransaction(signed, function(err, res){
        //         console.log("sendSignedTransaction  err: "+err);
        //         console.log("sendSignedTransaction  res: "+res);
        //     });
        // });

        // const url = `https://rinkeby.etherscan.io/tx/${receipt}`
