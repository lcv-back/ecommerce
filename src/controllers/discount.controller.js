'use strict';

const DiscountService = require("../services/discount.service");
const { SuccessResponse } = require('../core/success.response')

class DiscountController {
    // create a new discount code
    createDiscountCode = async(req, res, next) => {
        new SuccessResponse({
            message: 'Discount code created successfully!',
            metadata: await DiscountService.createDiscountCode({
                ...req.body,
                shopId: req.user.userId
            })
        }).send(res)
    }

    // get all discount codes from the shop
    getAllDiscountCodes = async(req, res, next) => {
        new SuccessResponse({
            message: 'All discount codes fetched successfully!',
            metadata: await DiscountService.getAllDiscountCodesByShop({
                ...req.query,
                shopId: req.user.userId
            })
        }).send(res)
    }

    // get discount amount
    getDiscountAmount = async(req, res, next) => {
        new SuccessResponse({
            message: 'Discount amount fetched successfully!',
            metadata: await DiscountService.getDiscountAmount({
                ...req.body
            })
        }).send(res)
    }

    // get all discount code with products
    getAllDiscountCodeWithProducts = async(req, res, next) => {
        new SuccessResponse({
            message: 'Discount code with products was found!',
            metadata: await DiscountService.getAllDiscountCodesWithProduct({
                ...req.query
            })
        }).send(res)
    }
}

module.exports = new DiscountController()