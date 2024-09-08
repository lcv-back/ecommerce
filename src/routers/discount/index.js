'use strict';

const express = require('express')
const router = express.Router()
const discountController = require('../../controllers/discount.controller');

const { authenticationV2 } = require('../../auth/authUtils');
const asyncHandler = require('../../helpers/asyncHandler')

// get amount a discount
router.post('/amount', asyncHandler(discountController.getDiscountAmount))

// get all discount code with product
router.get('/list_product_code', asyncHandler(discountController.getAllDiscountCodeWithProducts))

// authentication
router.use(authenticationV2)

// create a new discount
router.post('', asyncHandler(discountController.createDiscountCode))

// get all discount code with product
router.get('', asyncHandler(discountController.getAllDiscountCodeWithProducts))

module.exports = router