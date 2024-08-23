'use strict'

const { product } = require('../../models/product.model')
const { Types } = require('mongoose')
const { getSelectData, unGetSelectData } = require('../../utils')


const findAllDraftsForShop = async({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip })
}

const findAllPublishForShop = async({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip })
}

const findAllProducts = async({ limit, sort, page, filter, select }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }

    const products = await product.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean()

    return products
}

const findProduct = async({ product_id, unSelect }) => {
    return await product.findById(product_id).select(unGetSelectData(unSelect))
}

const searchProductByUser = async({ keySearch }) => {
    const regexSearch = new RegExp(keySearch)
    const results = await product.find({
            isDraft: false,
            $text: { $search: regexSearch }
        }, {
            score: { $meta: 'textScore' }
        })
        .sort({ score: { $meta: 'textScore' } })
        .lean();

    return results
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
};
/**
 * @description set 2 condition is reverse to publish: isPublished and isDraft is reverse to publish product
 */
const unPublishProductByShop = async({ product_shop, product_id }) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })

    if (!foundShop) {
        return null
    }

    // set 2 condition is reverse to publish
    foundShop.isDraft = true
    foundShop.isPublished = false

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
    findAllPublishForShop,
    unPublishProductByShop,
    searchProductByUser,
    findAllProducts,
    findProduct
}