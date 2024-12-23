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


// const createTokenPair = async(payload, publicKey, privateKey) => {
//     try {
//         // create access token through private key
//         const accessToken = await JWT.sign(payload, publicKey, {
//             expiresIn: '2 days'
//         });

//         // create refresh token through public key
//         const refreshToken = await JWT.sign(payload, privateKey, {
//             expiresIn: '7 days'
//         });

//         // verify the refresh token
//         JWT.verify(accessToken, publicKey, (err, decoded) => {
//             if (err) {
//                 console.error(`error verifying::`, err);
//             } else {
//                 console.log(`decoded verify::`, decoded);
//             }
//         });




//         return {
//             accessToken,
//             refreshToken
//         };
//     } catch (error) {
//         return error;
//     }
// };

const createTokenPair = async(payload, publicKey, privateKey) => {
    try {
        // create access token through private key
        const accessToken = await JWT.sign(payload, privateKey, {
            algorithm: 'RS256', // Chỉ định thuật toán
            expiresIn: '2 days'
        });

        // create refresh token through private key
        const refreshToken = await JWT.sign(payload, privateKey, {
            algorithm: 'RS256', // Chỉ định thuật toán
            expiresIn: '7 days'
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

        return {
            accessToken,
            refreshToken
        };
    } catch (error) {
        return error;
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

// const authenticationV2 = asyncHandler(async(req, res, next) => {
//     // if access token is expired => use refresh token => check refresh token have contain
//     const userId = req.headers[HEADER.CLIENT_ID]
//     if (!userId) throw new AuthFailureError('Invalid Request on line')

//     const keyStore = await findByUserId(userId)
//     if (!keyStore) throw new NotFoundError('Not found keyStore')

//     if (req.headers[HEADER.REFRESHTOKEN]) {
//         try {
//             const refreshToken = req.headers[HEADER.REFRESHTOKEN]

//             const decodeUser = JWT.verify(refreshToken, keyStore.privateKey)

//             if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid UserId')

//             req.keyStore = keyStore
//             req.user = decodeUser

//             req.refreshToken = refreshToken
//             return next()
//         } catch (error) {
//             throw error
//         }
//     }

//     // 3 - verify token
//     const accessToken = req.headers[HEADER.AUTHORIZATION]
//     if (!accessToken) throw new AuthFailureError('Invalid Request')

//     // 4 - check keyStore with this userId
//     try {
//         // const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
//         const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
//         req.user = decodeUser;
//         if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid UserId')
//         req.keyStore = keyStore

//         // 5 - ok all => return next
//         return next()
//     } catch (error) {
//         throw error
//     }
// })

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
            throw error
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
        throw error
    }
})


// const verifyJWT = async(token, keySecret) => {
//     return await JWT.verify(token, keySecret)
// }

const verifyJWT = async(token, keySecret) => {
    return await JWT.verify(token, keySecret, { algorithms: ['RS256'] })
}


module.exports = {
    createTokenPair,
    authentication,
    verifyJWT,
    authenticationV2
};