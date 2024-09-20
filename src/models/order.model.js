'use strict'

const { model, Schema, Types } = require('mongoose')

const DOCUMENT_NAME = 'Order'
const COLLECTION_NAME = 'Orders'

const orderSchema = new Schema({
    order_userId: {
        type: Number,
        required: true
    },

    /*
        order_checkout = {
            totalPrice,
            totalApplyDiscount,
            feeShip
        }
    */

    order_checkout: {
        type: Object,
        default: {}
    },

    /*
        order_shipping = {
            street,
            city,
            state,
            country
        }
    */

    order_shipping: {
        type: Object,
        default: {}
    },

    order_payment: {
        type: Object,
        default: {}
    },

    // nhung san pham chung ta mua, la shop_order_ids_new
    order_products: {
        type: Array,
        required: true,
    },

    // di theo nha van chuyen
    order_trackingNumber: {
        type: String,
        default: '#0000118052022'
    },

    order_status: {
        type: String,
        enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],

        /*
            - pending: don hang da duoc tao va dang cho xu ly
            - confirmed: don hang da duoc xu ly va xac nhan boi nguoi ban
            - shipped: don hang da duoc van chuyen va tren duong den tay nguoi dung
            - delivered: don hang da duoc giao cho nguoi dung
            - cancelled: don hang da bi huy do nguoi mua hoac nguoi ban do huy
        */

        default: 'pending'
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = {
    inventory: model(DOCUMENT_NAME, orderSchema)
}