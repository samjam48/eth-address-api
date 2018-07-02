import Joi from 'joi';
import { default as Web3 } from 'web3';

/**	Creates a callback that proxies node callback style arguments to an Express Response object.
 *	@param {express.Response} res	Express HTTP Response
 *	@param {number} [status=200]	Status code to send on success
 *
 *	@example
 *		list(req, res) {
 *			collection.find({}, toRes(res));
 *		}
 */
export function toRes(res, status=200) {

	console.log('util =', res)
	
	return (err, thing) => {
		if (err) return res.status(500).send(err);

		if (thing && typeof thing.toObject==='function') {
			thing = thing.toObject();
		}
		res.status(status).json(thing);
	};
}

export const validateAddress = input => {
	if ( !Web3.utils.isAddress(input) ) {
		throw new Error('Invalid Ethereum address');
	}
	return input;
}

export const balanceSchema = {
    params: {
        address: Joi.string().required()
    }
}

export const txSchema = {
    body: {
        privateKey: Joi.string().required(),
        destination: Joi.string().required(),
        amount: Joi.number().positive()
    }
}

export const apiInstructions = {
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

