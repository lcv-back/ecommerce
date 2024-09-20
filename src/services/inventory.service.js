'use strict';

const { BadRequestError } = require('../core/error.response');
// muc dich: tao lo hang moi nhap vao

const inventory = require('../models/inventory.model')
const { getProductById } = require('../models/repositories/product.repo')

class InventoryService {
    static async addStockToInventory({
        stock,
        productId,
        shopId,
        location = '616 Le Duc Tho, Phuong 15, Quan Go Vap, Ho Chi Minh City'
    }) {
        const product = await getProductById(productId)

        if (!product) throw new BadRequestError('Product not found')

        const query = {
                inven_shopId: shopId,
                inven_productId: productId
            },
            updateSet = {
                $inc: {
                    inven_stock: stock
                },
                $set: {
                    inven_location: location
                }
            },
            options = {
                upsert: true,
                new: true
            }

        return await inventory.findOneAndUpdate(query, updateSet, options)
    }
}

module.exports = InventoryService;