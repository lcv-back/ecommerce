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

    // handle refresh token
    // when token is used then set this token is blacklist
    // what else generate a new tokens pair
    static handleRefreshToken = async(refreshToken) => {
        /*
            - check this token used
        */
        // check token in dbs
        const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken)

        // if contain
        if (foundToken) {
            // decode this user, contain in db?
            const { userId, email } = await verifyJWT(refreshToken, foundToken.privateKey)
            console.log({ userId, email })

            // delete this refresh and access token in KeyStore
            await KeyTokenService.deleteKeyById(userId)

            throw new ForbiddenError('Sometime went wrong! Please try again')
        }

        // if not contain
        const holderToken = await KeyTokenService.findByRefreshToken(refreshToken)

        // if contain but don't reuse
        if (!holderToken) throw new AuthFailureError('User not registered! 1')

        // verify token
        const { userId, email } = await verifyJWT(refreshToken, holderToken.privateKey)
        console.log({ userId, email })

        // check userId is correct?
        const foundShop = await findByEmail({ email })

        // if dont find email in db
        if (!foundShop) throw new AuthFailureError('User not registered! 2')

        // create a new token pair
        const tokens = await createTokenPair({ userId, email }, holderToken.publicKey, holderToken.privateKey)

        // update the refresh token
        await holderToken.updateOne({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokensUsed: refreshToken // add current token to refresh token used array
            }
        })

        return {
            user: { userId, email },
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
        const match = bcrypt.compare(password, foundShop.password)

        if (!match) throw new AuthFailureError('Authentication failed!')

        // 3 - create access and refresh and save
        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')

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

            const privateKey = crypto.randomBytes(64).toString('hex')
            const publicKey = crypto.randomBytes(64).toString('hex')

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