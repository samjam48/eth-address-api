'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.apiInstructions = exports.txSchema = exports.balanceSchema = exports.validateAddress = undefined;
exports.toRes = toRes;

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _web = require('web3');

var _web2 = _interopRequireDefault(_web);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**	Creates a callback that proxies node callback style arguments to an Express Response object.
 *	@param {express.Response} res	Express HTTP Response
 *	@param {number} [status=200]	Status code to send on success
 *
 *	@example
 *		list(req, res) {
 *			collection.find({}, toRes(res));
 *		}
 */
function toRes(res) {
    var status = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 200;


    console.log('util =', res);

    return function (err, thing) {
        if (err) return res.status(500).send(err);

        if (thing && typeof thing.toObject === 'function') {
            thing = thing.toObject();
        }
        res.status(status).json(thing);
    };
}

var validateAddress = exports.validateAddress = function validateAddress(input) {
    if (!_web2.default.utils.isAddress(input)) {
        throw new Error('Invalid Ethereum address');
    }
    return input;
};

var balanceSchema = exports.balanceSchema = {
    params: {
        address: _joi2.default.string().required()
    }
};

var txSchema = exports.txSchema = {
    body: {
        privateKey: _joi2.default.string().required(),
        destination: _joi2.default.string().required(),
        amount: _joi2.default.number().positive()
    }
};

var apiInstructions = exports.apiInstructions = {
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
};
//# sourceMappingURL=util.js.map