'use strict'

const { SuccessResponse } = require('../core/success.response')
const ProductService = require('../services/product.service.xxx') // !!!

class ProductController {
    createProduct = async(req, res, next) => {
        new SuccessResponse({
            message: 'Product created successfully!',
            metadata: await ProductService.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId // decode from authentication (user, email)
            })
        }).send(res)
    };

    // update product
    updateProduct = async(req, res, next) => {
        new SuccessResponse({
            message: 'Update product successfully!',
            metadata: await ProductService.updateProduct(req.body.product_type, req.params.productId, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res)
    };

    publishProductByShop = async(req, res, next) => {
        new SuccessResponse({
            message: 'Publish product successfully!',
            metadata: await ProductService.publishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId // decode from authentication (user, email)
            })
        }).send(res)
    }

    unPublishProductByShop = async(req, res, next) => {
        new SuccessResponse({
            message: 'Unpublish product successfully!',
            metadata: await ProductService.unPublishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId // decode from authentication (user, email)
            })
        }).send(res)
    }

    // QUERY
    getAllDraftsForShop = async(req, res, next) => {
        new SuccessResponse({
            message: 'Get list drafts successfully!',
            metadata: await ProductService.findAllDraftsForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    };

    getAllPublishForShop = async(req, res, next) => {
        new SuccessResponse({
            message: 'Get list published successfully!',
            metadata: await ProductService.findAllPublishForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    };

    getListSearchProduct = async(req, res, next) => {
        new SuccessResponse({
            message: 'Get list search product successfully!',
            metadata: await ProductService.searchProducts(req.params) // key search
        }).send(res)
    };

    findAllProducts = async(req, res, next) => {
        new SuccessResponse({
            message: 'Find all products successfully!',
            metadata: await ProductService.findAllProducts(req.query)
        }).send(res)
    };

    findProduct = async(req, res, next) => {
        new SuccessResponse({
            message: 'Find product successfully!',
            metadata: await ProductService.findProduct({
                product_id: req.params.product_id
            })
        }).send(res)
    };
    // END QUERY
}

module.exports = new ProductController()