'use strict';

const express = require('express');
const router = express.Router()
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authenticationV2 } = require('../../auth/authUtils')
const inventoryController = require('../../controllers/inventory.controller')

router.use(authenticationV2)
router.post('', asyncHandler(inventoryController.addStockToInventory))

module.exports = router