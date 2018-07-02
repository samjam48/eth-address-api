'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _util = require('../lib/util');

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

require('babel-polyfill');

var _ethereumjsTx = require('ethereumjs-tx');

var _ethereumjsTx2 = _interopRequireDefault(_ethereumjsTx);

var _express = require('express');

var _web = require('web3');

var _web2 = _interopRequireDefault(_web);

var _expressValidation = require('express-validation');

var _expressValidation2 = _interopRequireDefault(_expressValidation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = function (_ref) {
    var config = _ref.config;

    var api = (0, _express.Router)();
    var web3 = new _web2.default(new _web2.default.providers.HttpProvider("https://rinkeby.infura.io/"));

    api.get('/', function (req, res) {
        res.json(_util.apiInstructions);
    });

    // Generate a new Ethereum wallet and return an object with the private key and the public ETH address
    api.get('/createWallet', function (req, res) {
        var wallet = web3.eth.accounts.create();
        res.json(wallet);
    });

    //Get the balance of an ethereum address
    api.get('/getBalance/:address', (0, _expressValidation2.default)(_util.balanceSchema), function () {
        var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
            var address, balance;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            address = (0, _util.validateAddress)(req.params.address);
                            _context.next = 3;
                            return web3.eth.getBalance(address);

                        case 3:
                            balance = _context.sent;

                            res.json({ balance: balance, "units": "wei" });

                        case 5:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, undefined);
        }));

        return function (_x, _x2) {
            return _ref2.apply(this, arguments);
        };
    }());

    // Creates a transaction to send ETH from one address to another
    api.post('/transaction', (0, _expressValidation2.default)(_util.txSchema), function () {
        var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res, next) {
            var _req$body, privateKey, destination, amount, privateKeyBuffer, destinationAddress, publicAddress, gasPrices, nonce, txValue, rawTx, tx, serializedTx, txDetails;

            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _req$body = req.body, privateKey = _req$body.privateKey, destination = _req$body.destination, amount = _req$body.amount;
                            privateKeyBuffer = new Buffer(privateKey, 'hex');
                            destinationAddress = (0, _util.validateAddress)(destination);
                            _context2.next = 5;
                            return web3.eth.accounts.privateKeyToAccount("0x" + privateKey).address;

                        case 5:
                            publicAddress = _context2.sent;
                            _context2.next = 8;
                            return _axios2.default.get('https://ethgasstation.info/json/ethgasAPI.json');

                        case 8:
                            gasPrices = _context2.sent;
                            _context2.next = 11;
                            return web3.eth.getTransactionCount(publicAddress);

                        case 11:
                            nonce = _context2.sent;
                            txValue = web3.utils.toHex(web3.utils.toWei(amount.toString(), 'ether'));
                            rawTx = {
                                "to": destinationAddress,
                                "value": txValue,
                                "gasPrice": gasPrices.data.safeLow * 100000000,
                                "nonce": nonce,
                                "chainId": 4 // EIP 155 chainId - mainnet: 1, rinkeby: 4
                            };
                            _context2.next = 16;
                            return web3.eth.estimateGas(rawTx);

                        case 16:
                            rawTx.gas = _context2.sent;

                            web3.eth.defaultAccount = publicAddress;

                            tx = new _ethereumjsTx2.default(rawTx);

                            tx.sign(privateKeyBuffer);
                            serializedTx = tx.serialize();
                            _context2.next = 23;
                            return web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));

                        case 23:
                            txDetails = _context2.sent;

                            res.json(txDetails);

                        case 25:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, undefined);
        }));

        return function (_x3, _x4, _x5) {
            return _ref3.apply(this, arguments);
        };
    }());

    return api;
};
//# sourceMappingURL=index.js.map