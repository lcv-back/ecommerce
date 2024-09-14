'use strict';

const express = require('express')
const router = express.Router()
const cartController = require('../../controllers/cart.controller');

const { authenticationV2 } = require('../../auth/authUtils');
const asyncHandler = require('../../helpers/asyncHandler')

// Add to cart: Test done
router.post('', asyncHandler(cartController.addToCart))

// Delete cart item: Test done
router.delete('', asyncHandler(cartController.deleteUserCart))

// Update cart items: Test done
router.post('/update', asyncHandler(cartController.updateCart))

// List cart allocate cart items: Test done
router.get('', asyncHandler(cartController.listOnCart))

module.exports = router