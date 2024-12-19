'use strict';

const redis = require('@redis/client'); // Đảm bảo sử dụng Redis client v4 trở lên
const { reservationInventory } = require('../models/repositories/inventory.repo');

// Tạo Redis client
const redisClient = redis.createClient();

// Gianh quyền khóa
const acquireLock = async(productId, quantity, cartId) => {
    const key = `lock_v2024_${productId}`; // Tên khóa dựa trên productId
    const retryTimes = 10; // Số lần thử
    const expireTime = 3000; // Thời gian hết hạn (3 giây)

    for (let i = 0; i < retryTimes; i++) {
        // Thử tạo khóa và kiểm tra xem có thể chiếm được khóa không
        const result = await redisClient.setNX(key, expireTime);
        console.log(`result::`, result);

        if (result === 1) {
            // Thao tác với inventory nếu chiếm được khóa
            const isReservation = await reservationInventory({
                productId,
                quantity,
                cartId
            });

            if (isReservation.modifiedCount) {
                // Nếu thành công, thiết lập thời gian hết hạn và trả khóa lại
                await redisClient.pexpire(key, expireTime); // Giải phóng khóa sau khi hoàn thành
                return key;
            }

            return null; // Nếu không thể đặt hàng, trả về null
        } else {
            // Nếu không chiếm được khóa, chờ 50ms và thử lại
            await new Promise((resolve) => setTimeout(resolve, 50));
        }
    }

    return null; // Trả về null nếu không chiếm được khóa sau khi thử hết retryTimes
};

// Giải phóng khóa
const releaseLock = async(keyLock) => {
    // Xóa khóa khỏi Redis
    await redisClient.del(keyLock);
};

module.exports = {
    acquireLock,
    releaseLock
};