'use strict'

const { product } = require('../../models/product.model')
const { Types } = require('mongoose')

const findAllDraftsForShop = async({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip })
}

const findAllPublishForShop = async({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip })
}

/**
 * @description set 2 condition: isDraft and isPublished is reverse to publish product
 */
const publishProductByShop = async({ product_shop, product_id }) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })

    if (!foundShop) {
        return null
    }

    // set 2 condition is reverse to publish
    foundShop.isDraft = false
    foundShop.isPublished = true

    const { modifiedCount } = await foundShop.updateOne(foundShop)

    return modifiedCount
}

const queryProduct = async({ query, limit, skip }) => {
    return await product.find(query)
        .populate('product_shop', 'name email -_id')
        .sort({ updateAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec() // maybe yes or not
}

module.exports = {
    findAllDraftsForShop,
    publishProductByShop,
    findAllPublishForShop
}