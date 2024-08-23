'use strict'

const express = require('express')
const router = express.Router()
const productController = require('../../controllers/product.controller')
const asyncHandler = require('../../helpers/asyncHandler')
const { authenticationV2 } = require('../../auth/authUtils')

// get list search by user, don't need authentication but don't login to system
router.get('/search/:keySearch', asyncHandler(productController.getListSearchProduct))

// find all products by user: home page
router.get('', asyncHandler(productController.findAllProducts))

// find product
router.get('/:product_id', asyncHandler(productController.findProduct))

// authentication
router.use(authenticationV2)

// create new product
router.post('', asyncHandler(productController.createProduct))

// publish new product by seller
router.post('/publish/:id', asyncHandler(productController.publishProductByShop))

// unpublish product by seller
router.post('/unpublish/:id', asyncHandler(productController.unPublishProductByShop))

// query
/**
 * @description Get all drafts for shop
 * @param {Number} limit
 * @param {Number} skip
 * @param {query} product_shop
 * @returns {JSON} 
 */
router.get('/drafts/all', asyncHandler(productController.getAllDraftsForShop))


/**
 * @description Get all published for shop
 */
router.get('/published/all', asyncHandler(productController.getAllPublishForShop))

module.exports = router