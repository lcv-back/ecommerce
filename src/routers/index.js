'use strict';

const express = require('express');
const { apiKey, permission } = require('../auth/checkAuth');
const router = express.Router();

// check apikey
router.use(apiKey)


// check permission
router.use(permission('0000'))

// router for access: login, logout and sign in
router.use('/v1/api', require('./access'))

// router for product
router.use('/v1/api/product', require('./product'))


module.exports = router;