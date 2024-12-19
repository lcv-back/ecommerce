const redisPubsubService = require('../services/redisPubsub.service')

class ProductServiceTest {

    purcharseProduct(productId, quantity) {
        const order = {
            productId,
            quantity
        }

        redisPubsubService.publish('purchase_events', JSON.stringify(order))
    }
}

module.exports = new ProductServiceTest()