'use strict';

const cart = require('../models/cart.model')

const {
    BadRequestError,
    NotFoundError
} = require('../core/error.response');
const { getProductById } = require('../models/repositories/product.repo');

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

    static async updateUserCartQuantity({ userId, product }) {
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

    /* Update cart
        shop_order_ids: [
            {
                shopId,
                item_products: [
                    {
                        quantity,
                        price,
                        shopId,
                        old_quantity,
                        productId
                    }
                ],
                versions
            }
        ]
    */

    static async updateCart({ userId, shop_order_ids }) {
        const itemProduct = shop_order_ids[0] && shop_order_ids[0].item_products ? shop_order_ids[0].item_products[0] : {};
        const { productId, quantity, old_quantity } = itemProduct;
        console.log({ productId, quantity, old_quantity });


        // check product
        const foundProduct = await getProductById(productId);

        console.log(foundProduct);

        if (!foundProduct) throw new NotFoundError('Product not found!')

        // compare
        const shopId = shop_order_ids[0] ? shop_order_ids[0].shopId : '';

        if (foundProduct.product_shop.toString() !== shopId) {
            throw new BadRequestError('Product do not belong to the shop');
        }

        if (quantity === 0) {
            return await CartService.deleteUserCart({ userId, productId });
        }

        return await CartService.updateUserCartQuantity({
            userId,
            product: {
                productId,
                quantity: old_quantity - quantity
            } // update quantity to old_quantity - quantity
        })


        // check quantity
    }

    static async deleteUserCart({ userId, productId }) {
        const query = {
                cart_userId: userId,
                cart_state: 'active'
            },
            updateSet = {
                $pull: {
                    cart_products: {
                        productId
                    }
                }
            }

        const deleteCart = await cart.updateOne(query, updateSet);

        return deleteCart;
    }

    static async getListUserCart({ userId }) {
        return await cart.findOne({
            cart_userId: +userId
        }).lean()
    }
}

module.exports = CartService;