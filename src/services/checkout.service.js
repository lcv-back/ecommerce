'use strict';

const { findCartById } = require("../models/repositories/cart.repo");
const { BadRequestError } = require('../core/error.response');
const { checkProductByServer } = require("../models/repositories/product.repo");
const { getDiscountAmount } = require('./discount.service');
const { releaseLock } = require("./redis.service");
const order = require('../models/order.model');


/*
    Order Services
*/

class CheckoutService {

    /*
    login and without login
        {
            cartId,
            userId,
            shop_order_ids: [
                {
                    shopId,
                    shop_discounts: [],
                    item_products: [
                        {
                            price,
                            quantity,
                            productId
                        }
                    ]
                }
            ]
        }
    */

    static async checkoutReview({
        cartId,
        userId,
        shop_order_ids = [],
    }) {
        // check cartId is contain?
        const foundCart = await findCartById(cartId)
        if (!foundCart) throw new BadRequestError('Cart not found')

        const checkout_order = {
                totalPrice: 0, // tong tien hang
                feeShip: 0, // phi van chuyen,
                totalDiscount: 0, // tong tien discount giam gia
                totalCheckout: 0 // tong thanh toan
            },
            shop_order_ids_new = []

        // tinh tong tien bill
        for (let i = 0; i < shop_order_ids.length; i++) {
            const { shopId, shop_discounts = [], item_products = [] } = shop_order_ids[i]

            // check product is available
            const checkProductServer = await checkProductByServer(item_products)
            console.log(`checkProductServer::`, checkProductServer)

            // if any item_product is invalid
            if (!checkProductServer[0]) throw new BadRequestError('Order wrong')

            // tong tien don hang
            const checkoutPrice = checkProductServer.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)

            // tong tien truoc khi xu ly
            checkout_order.totalPrice += checkoutPrice

            // push vao order new   
            const itemCheckout = {
                shopId,
                shop_discounts,
                priceRaw: checkoutPrice, // tong tien truoc khi giam gia
                priceApplyDiscount: checkoutPrice,
                item_products: checkProductServer
            }

            // neu shop_discounts ton tai => > 0
            if (shop_discounts.length > 0) {
                // gia su o day chi co 1 discount
                // get amoung discount

                const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
                    codeId: shop_discounts[0].codeId,
                    userId,
                    shopId,
                    products: checkProductServer
                })

                // tong discount giam gia
                checkout_order.totalDiscount += discount

                // tong tien sau khi giam gia
                if (discount > 0) {
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount
                }

            }

            // tong thanh toan cuoi cung
            checkout_order.totalCheckout += itemCheckout.priceApplyDiscount

            shop_order_ids_new.push(itemCheckout)

        }

        // Trong he thong lon, thi trackking hanh vi nguoi dung, save vao 1 bo nho tam roi kiem tra hang ton kho

        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order
        }
    }

    static async orderByUser({
        shop_order_ids,
        cartId,
        userId,
        user_address = {},
        user_payment = {}
    }) {
        const { shop_order_ids_new, checkout_order } = await CheckoutService.checkoutReview({
            cartId,
            userId,
            shop_order_ids
        })

        // kiem tra 1 lan nua xem co vuot ton kho hay khong
        // get new array Products
        const products = shop_order_ids_new.flagMap(order => order.item_products)
        console.log(`[1]::`, products)

        const acquireProduct = []

        // den buoc cuoi cung thi kiem tra hang ton kho ma lon hon so luong nguoi dung thi moi chap nhan
        for (let i = 0; i < products.length; i++) {
            const { productId, quantity } = products[i];
            const keyLock = await acquireLock(productId, quantity, cartId)
            acquireProduct.push(keyLock ? true : false)

            if (keyLock) {
                await releaseLock(keyLock)
            }
        }

        // kiem tra neu co san pham het hang trong kho
        if (acquireProduct.includes(false)) {
            throw new BadRequestError('Any product was updated, retry back to your cart')
        }

        const newOrder = await order.create({
            order_userId: userId,
            order_checkout: checkout_order,
            order_shipping: user_address,
            order_payment: user_payment,
            order_products: shop_order_ids_new,
        })

        // truong hop: insert thanh cong, thi remove product co trong cart
        if (newOrder) {
            // remove product on cart
        }

        return newOrder
    }

    /*
        1> Query Order [Users]: Get total order on current cart
    */

    static async getOrdersByUser() {

    }

    /*
        2> Query Order using Id [Users]: Get total order using id on current cart
    */

    static async getOrderByUser() {

    }

    /*
        3> Cancel Order [Users]: Cancel the order by users
    */

    static async cancelOrder() {

    }

    /*
        4> Update Order Status [Shop | Admin]: Update the order by shop and admin
    */

    static async updateOrderStatus() {

    }

}

module.exports = CheckoutService;