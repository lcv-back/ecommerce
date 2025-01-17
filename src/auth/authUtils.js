'use strict';

const JWT = require('jsonwebtoken');
const asyncHandler = require('../helpers/asyncHandler');
const { AuthFailureError, NotFoundError } = require('../core/error.response');

// service
const { findByUserId } = require('../services/keyToken.service');

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    REFRESHTOKEN: 'x-rtoken-id',
}

const createTokenPair = async(payload, publicKey, privateKey) => {
    try {
        // create access token using private key
        const accessToken = JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '2d'
        });

        // create refresh token using private key
        const refreshToken = JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '7d'
        });

        // verify the access token using public key
        JWT.verify(accessToken, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
            if (err) {
                console.error(`Error verifying access token:`, err);
            } else {
                console.log(`Decoded access token:`, decoded);
            }
        });

        // verify the refresh token using public key
        JWT.verify(refreshToken, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
            if (err) {
                console.error(`Error verifying refresh token:`, err);
            } else {
                console.log(`Decoded refresh token:`, decoded);
            }
        });

        return { accessToken, refreshToken };
    } catch (error) {
        console.error(`Error creating token pair:`, error);
        throw new Error('Error creating token pair');
    }
};

const authentication = asyncHandler(async(req, res, next) => {
    /*
        1 - check userId missing?
        2 - get access token
        3 - verify token
        4 - check user in db (on step 1)
        5 - check keyStore with this userId
        6 - ok all => return next
    */

    // 1 - check userId missing?
    const userId = req.headers[HEADER.CLIENT_ID]
    if (!userId) throw new AuthFailureError('Invalid Request')

    // 2 - get access token
    const keyStore = await findByUserId(userId)
    if (!keyStore) throw new NotFoundError('Not found keyStore')

    // 3 - verify token
    // const accessToken = req.headers[HEADER.AUTHORIZATION]
    // test fix bug: invalid signature
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey, { algorithms: ['RS256'] });

    if (!accessToken) throw new AuthFailureError('Invalid Request')

    // 4 - check keyStore with this userId
    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid UserId')
        req.keyStore = keyStore

        // 5 - ok all => return next
        return next()
    } catch (error) {
        throw error
    }
})

const authenticationV2 = asyncHandler(async(req, res, next) => {
    // 1. Lấy userId từ headers
    const userId = req.headers[HEADER.CLIENT_ID]
    if (!userId) throw new AuthFailureError('Invalid Request')

    // 2. Tìm keyStore dựa trên userId
    const keyStore = await findByUserId(userId)
    if (!keyStore) throw new NotFoundError('Not found keyStore')

    // 3. Kiểm tra xem có refresh token không
    if (req.headers[HEADER.REFRESHTOKEN]) {
        try {
            const refreshToken = req.headers[HEADER.REFRESHTOKEN]

            // Xác minh refresh token bằng publicKey
            const decodeUser = JWT.verify(refreshToken, keyStore.publicKey, { algorithms: ['RS256'] })

            if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid UserId')

            req.keyStore = keyStore
            req.user = decodeUser

            req.refreshToken = refreshToken
            return next()
        } catch (error) {
            throw new AuthFailureError('Refresh token verification failed: ' + error.message);
        }
    }

    // 4. Kiểm tra và xác minh access token
    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if (!accessToken) throw new AuthFailureError('Invalid Request')

    try {
        // Xác minh access token bằng publicKey
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey, { algorithms: ['RS256'] })
        req.user = decodeUser
        if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid UserId')
        req.keyStore = keyStore

        return next()
    } catch (error) {
        throw new AuthFailureError('Access token verification failed: ' + error.message);
    }
})

const verifyJWT = async(token, keySecret) => {
    try {
        return await JWT.verify(token, keySecret, { algorithms: ['RS256'] });
    } catch (error) {
        throw new Error('Token verification failed: ' + error.message);
    }
};



module.exports = {
    createTokenPair,
    authentication,
    verifyJWT,
    authenticationV2
};