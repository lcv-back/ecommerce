'use strict';

const cart = require('../models/apikey.model')

const {
    BadRequestError,
    NotFoundError
} = require('../core/error.response')

/*
    Key Features
    - Add product to cart [User]
    - Reduce product quantity by one [User]
    - Increase product quantity by one [User]
    - Get cart [User]
    - Delete cart [User]
    - Delete cart item [User]
*/

class CartService {

    static async createUserCart({ userId, product }) {
        const query = {
                cart_userId: userId,
                cart_state: 'active'
            },
            updateOrInsert = {
                $addToSet: {
                    cart_products: product
                }
            },
            options = {
                upsert: true,
                new: true
            }

        return await cart.findOneAndUpdate(query, updateOrInsert, options)
    }

    static async updateUserCartQuantity([userId, product]) {
        const { productId, quantity } = product

        const query = {
                cart_userId: userId,
                'cart_products.productId': productId, // tim kiem co trong array hay khong
                cart_state: 'active'
            },
            updateSet = {
                $inc: {
                    'cart_products.$.quantity': quantity // neu tim thay thi se update chinh tai phan tu do (ki hieu: $)
                }
            },
            options = {
                upsert: true,
                new: true
            }

        return await cart.findOneAndUpdate(query, updateSet, options)
    }

    static async addToCart({ userId, product = {} }) {
        // check cart is contain on db?
        const userCart = await cart.findOne({
            cart_userId: userId
        })

        // case 1: if user cart is not contain on db
        if (!userCart) {
            // create new cart for user
            return await CartService.createUserCart({ userId, product })
        }

        // case 2: if user cart is contain on db but empty cart
        if (!userCart.cart_products.length) {
            userCart.cart_products = [product] // add products to cart
            return await userCart.save()
        }

        // case 3: if user cart is contain on db and have products
        return await CartService.updateUserCartQuantity({ userId, product })
    }
}

module.exports = CartService;