'use strict';

const express = require('express');
const { apiKey, permission } = require('../auth/checkAuth');
const router = express.Router();

// check apikey
router.use(apiKey)


// check permission
router.use(permission('0000'))

// router for checkout
router.use('/v1/api/checkout', require('./checkout'))

// router for discount
router.use('/v1/api/discount', require('./discount'))

// router for cart
router.use('/v1/api/cart', require('./cart'))

// router for product
router.use('/v1/api/product', require('./product'))

// router for access: login, logout and sign in
router.use('/v1/api', require('./access'))




module.exports = router;