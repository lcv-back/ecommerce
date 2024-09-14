'use strict';

const CartService = require("../services/cart.service");

const { SuccessResponse } = require('../core/success.response')

class CartController {

    addToCart = async(req, res, next) => {
        new SuccessResponse({
            message: 'Product added to cart successfully!',
            metadata: await CartService.addToCart(req.body)
        }).send(res)
    }

    updateCart = async(req, res, next) => {
        new SuccessResponse({
            message: 'Product updated successfully!',
            metadata: await CartService.updateCart(req.body)
        }).send(res)
    }

    deleteUserCart = async(req, res, next) => {
        new SuccessResponse({
            message: 'Product deleted successfully!',
            metadata: await CartService.deleteUserCart(req.body)
        }).send(res)
    }


    listOnCart = async(req, res, next) => {
        new SuccessResponse({
            message: 'List cart successfully!',
            metadata: await CartService.getListUserCart(req.query)
        }).send(res)
    }
}

module.exports = new CartController;