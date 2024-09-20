'use strict';

const redis = require('redis');
const { promisify } = require('util'); // Convert a callback-based function to an async-await one
const { reservationInventory } = require('../models/repositories/inventory.repo');
const redisClient = redis.createClient();

const pexpire = promisify(redisClient.pExpire).bind(redisClient);
const setnxAsync = promisify(redisClient.setNX).bind(redisClient);

// gianh quyen khoa
const acquireLock = async(productId, quantity, cartId) => {
    const key = `lock_v2024_${productId}`; // 
    const retryTimes = 10; // cho phep thread or process co the cho trong bao nhieu lan
    const expireTime = 3000; // time out is 3 second

    for (let i = 0; i < retryTimes.length; i++) {
        // create key, who keep the key can payment
        const result = await setnxAsync(key, expireTime)
        console.log(`result::`, result);

        if (result === 1) {
            // thao tac voi inventory
            const isReservation = await reservationInventory({
                productId,
                quantity,
                cartId
            })

            if (isReservation.modifiedCount) {
                await pexpire(key, expireTime) // giai phong key cho nguoi khac thanh toan
                return key
            }

            return null
        } else {
            await new Promise((resolve) => setTimeout(resolve, 50))
        }



    }
}

// giai phong khoa
const releaseLock = async keyLock => {
    const delAsyncKey = promisify(redisClient.del).bind(redisClient)
    return await delAsyncKey(keyLock)
}

module.exports = {
    acquireLock,
    releaseLock
}