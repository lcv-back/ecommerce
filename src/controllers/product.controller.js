'use strict'

const { SuccessResponse } = require('../core/success.response')
const ProductService = require('../services/product.service.xxx')

class ProductController {
    createProduct = async(req, res, next) => {
        new SuccessResponse({
            message: 'Product created successfully!',
            metadata: await ProductService.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res)
    }
}

module.exports = new ProductController()