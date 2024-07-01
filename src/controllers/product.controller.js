'use strict'

const { SuccessResponse } = require('../core/success.response')
const productService = require('../services/product.service')

class ProductController {
    createProduct = async(req, res, next) => {

        new SuccessResponse({
            message: 'Product created successfully!',
            metadata: await productService.createProduct(req.body.product_type, req.body)
        }).send(res)
    }
}

module.exports = new ProductController();