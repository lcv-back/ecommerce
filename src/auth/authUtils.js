'use strict';

const JWT = require('jsonwebtoken');

const createTokenPair = async(payload, publicKey, privateKey) => {
    try {
        // create access token through private key
        const accessToken = await JWT.sign(payload, publicKey, {
            expiresIn: '2 days'
        });

        // create refresh token through public key
        const refreshToken = await JWT.sign(payload, privateKey, {
            expiresIn: '7 days'
        });

        // verify the refresh token
        JWT.verify(accessToken, publicKey, (err, decoded) => {
            if (err) {
                console.error(`error verifying::`, err);
            } else {
                console.log(`decoded verify::`, decoded);
            }
        });

        return {
            accessToken,
            refreshToken
        };
    } catch (error) {
        return error;
    }
};

module.exports = {
    createTokenPair
};