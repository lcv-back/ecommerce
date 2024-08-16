'use strict'

const express = require('express')
const router = express.Router()
const productController = require('../../controllers/product.controller')
const asyncHandler = require('../../helpers/asyncHandler')
const { authenticationV2 } = require('../../auth/authUtils')


// authentication
router.use(authenticationV2)

// create new product
router.post('', asyncHandler(productController.createProduct))

// query
/**
 * @description Get all drafts for shop
 * @param {Number} limit
 * @param {Number} skip
 * @param {query} product_shop
 * @returns {JSON} 
 */
router.get('/drafts/all', asyncHandler(productController.getAllDraftsForShop))

module.exports = router