'use strict';

const shopModel = require("../models/shop.model");
const bcrypt = require('bcrypt'); // purpose: hash password to security better
const crypto = require('crypto');
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
};

class AccessService {

    // sign up
    static signUp = async({ name, email, password }) => {
        try {
            // step 1: check email exists?
            const holderShop = await shopModel.findOne({ email }).lean();
            if (holderShop) {
                return {
                    code: 'xxxx',
                    message: 'Shop already exists'
                }
            }

            // hash password by using bcrypt
            const passwordHash = await bcrypt.hash(password, 10);
            // hash method in bcrypt object have 2 paramester(first: original password, second: salt (complexity of algorithm))

            // if shop dont exist, create
            const newShop = await shopModel.create({ name, email, password, roles: [RoleShop.SHOP] });

            // after register is completed then provide the token for user
            if (newShop) {
                // created privateKey, publicKey
                const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                    modulusLength: 4096
                });

                console.log({ privateKey, publicKey }); // save collection KeyStore

                const publicKeyString = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey: publicKey
                });

                if (!publicKeyString) {
                    return {
                        code: 'xxx',
                        message: error.message,
                        status: 'publicKeyString error'
                    }
                }

                // create tokens pair
                const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey);
                console.log(`Created Token Successfully::`, tokens);


                return {
                    code: 201,
                    metadata: {
                        shop: newShop,
                        tokens
                    }
                }

                // const tokens = await
            }

            return {
                code: 200,
                metadata: null
            }


        } catch (error) {
            return {
                code: 'xxx',
                message: error.message,
                status: 'error'
            }
        }
    }
}

module.exports = AccessService;