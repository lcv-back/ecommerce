'use strict';

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt') // purpose: hash password to security better
const crypto = require('node:crypto')
const KeyTokenService = require("./keyToken.service")
const { createTokenPair, verifyJWT } = require("../auth/authUtils")
const { getInfoData } = require("../utils")
const { BadRequestError, AuthFailureError, ForbiddenError } = require("../core/error.response")
const { findByEmail } = require("./shop.service")

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
};

class AccessService {

    /*
        step by step to handle refresh token
        1 - check this token was used?


        when refresh token is expired => that user is not allowed to access
    */

    static handleRefreshTokenV2 = async({ keyStore, user, refreshToken }) => {
        const { userId, email } = user

        if (keyStore.refreshTokensUsed.includes(refreshToken)) {
            await KeyTokenService.deleteKeyById(userId)
            throw new ForbiddenError('Something went wrong! Please try again')
        }

        if (keyStore.refreshToken !== refreshToken) throw new AuthFailureError('Shop not registered 1')

        const foundShop = await findByEmail({ email })


        if (!foundShop) throw new AuthFailureError('Shop not registered 2')

        const tokens = await createTokenPair({ userId, email }, keyStore.publicKey, keyStore.privateKey)

        // update tokens
        await keyStore.updateOne({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokensUsed: refreshToken
            }
        })

        return {
            user,
            tokens
        }
    }

    // log out
    static logout = async(keyStore) => {
        const delKey = await KeyTokenService.removeKeyById(keyStore._id)
        console.log({ delKey })
        return delKey
    }

    /*
        1 - check email in db
        2 - match password
        3 - create access and refresh and save
        4 - generate tokens
        5 - get data return login
    */

    static login = async({ email, password, refreshToken = null }) => {
        const foundShop = await findByEmail({ email })

        // 1 - check email in db
        if (!foundShop) {
            throw new BadRequestError('Error: Email not registered!')
        }

        // 2 - match password
        const match = await bcrypt.compare(password, foundShop.password)

        if (!match) throw new AuthFailureError('Authentication failed!')

        // 3 - create access and refresh and save
        const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem'
            }
        });

        // 4 - generate tokens
        const { _id: userId } = foundShop

        const tokens = await createTokenPair({ userId, email }, publicKey, privateKey)

        await KeyTokenService.createKeyToken({
            refreshToken: tokens.refreshToken,
            privateKey,
            publicKey,
            userId
        })

        // 5 - get data return login
        return {
            shop: getInfoData({
                fields: ['_id', 'name', 'email'],
                object: foundShop
            }),
            tokens
        }
    }


    // sign up
    static signUp = async({ name, email, password }) => {
        // step 1: check email exists?
        const holderShop = await shopModel.findOne({ email }).lean();
        if (holderShop) {
            throw new BadRequestError('Error: Shop already registered!')
        }

        // hash password by using bcrypt
        const passwordHash = await bcrypt.hash(password, 10);
        // hash method in bcrypt object have 2 paramester(first: original password, second: salt (complexity of algorithm))

        // if shop dont exist, create
        const newShop = await shopModel.create({ name, email, password: passwordHash, roles: [RoleShop.SHOP] });

        // after register is completed then provide the token for user
        if (newShop) {
            // created privateKey, publicKey

            const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
                modulusLength: 2048, // Độ dài của khóa
                publicKeyEncoding: {
                    type: 'spki',
                    format: 'pem'
                },
                privateKeyEncoding: {
                    type: 'pkcs8',
                    format: 'pem'
                }
            });

            console.log({ privateKey, publicKey }); // save collection KeyStore

            const keyStore = await KeyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey,
                privateKey
            });

            if (!keyStore) {
                throw new BadRequestError('Error: KeyStore can not created!')
            }

            // create tokens pair
            const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey)
            console.log(`Created Token Successfully::`, tokens);


            return {
                code: 201,
                metadata: {
                    shop: getInfoData({
                        fields: ['_id', 'name', 'email'],
                        object: newShop
                    }),
                    tokens
                }
            }

        }

        return {
            code: 200,
            metadata: null
        }

    }
}

module.exports = AccessService;