'use strict';

/*
    Discount Services
    1 - Generator discount code 
        Shop: Voucher for shop
        Admin: Voucher for global
    2 - Get discount amount
        User
    3- Get all discount codes
        Shop: Management
        User
    4 - Verify discount code
        User
    5 - Delete discount codes
        Shop
        Admin
    6 - Cancel discount codes
        User
*/

const {
    BadRequestError,
    NotFoundError
} = require('../core/error.response')

const discount = require('../models/discount.model');
const {
    findAllDiscountCodesUnSelect,
    findAllDiscountCodesSelect,
    checkDiscountExists
} = require('../models/repositories/discount.repo');
const { findAllProducts } = require('../models/repositories/product.repo');
const { convertToObjectIdMongodb } = require('../utils');

class DiscountService {
    static async createDiscountCode(payload) {
        const {
            code,
            start_date,
            end_date,
            is_active,
            shopId,
            min_order_value,
            product_ids,
            applies_to,
            name,
            description,
            type,
            value,
            max_value,
            max_uses,
            uses_count,
            max_uses_per_user,
            users_used
        } = payload

        // check the valid time
        if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
            throw new BadRequestError('Discount code has expired! Please try again')
        }

        if (new Date(start_date) >= new Date(end_date)) {
            throw new BadRequestError('Start date must be before end date')
        }

        // create index for discount code
        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: convertToObjectIdMongodb(shopId)
        }).lean()

        if (foundDiscount && foundDiscount.discount_is_active) {
            throw new BadRequestError('Discount exsist')
        }

        const newDiscount = await discount.create({
            discount_code: code,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_is_active: is_active,
            discount_shopId: shopId,
            discount_min_order_value: min_order_value || 0,
            discount_applies_to: applies_to,
            discount_product_ids: applies_to === 'all' ? [] : product_ids,
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_value: value,
            discount_max_value: max_value,
            discount_max_uses: max_uses,
            discount_uses_count: uses_count,
            discount_max_uses_per_user: max_uses_per_user,
            discount_users_used: users_used
        })

        return newDiscount
    }

    static async updateDiscountCode() {
        // ...
    }

    static async getAllDiscountCodesWithProduct({
        code,
        shopId,
        userId,
        limit,
        page
    }) {
        // create index for discount_code
        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: convertToObjectIdMongodb(shopId)
        }).lean()


        if (!foundDiscount || !foundDiscount.discount_is_active) {
            throw new NotFoundError('The discount does not exsit')
        }

        const { discount_applies_to, discount_product_ids } = foundDiscount

        let products

        if (discount_applies_to === 'all') {
            // get all products
            products = await findAllProducts({
                filter: {
                    product_shop: convertToObjectIdMongodb(shopId),
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }

        if (discount_applies_to === 'specific') {
            // get products by ids
            products = await findAllProducts({
                filter: {
                    _id: { $in: discount_product_ids },
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }

        return products
    }

    static async getAllDiscountCodesByShop({
        limit,
        page,
        shopId
    }) {
        const discounts = await findAllDiscountCodesUnSelect({
            limit: +limit,
            page: +page,
            filter: {
                discount_shopId: convertToObjectIdMongodb(shopId),
                discount_is_active: true
            },
            unSelect: ['__v', 'discount_shopId'],
            model: discount
        })

        return discounts
    }

    /*
        Apply discount code

    */

    static async getDiscountAmount({ codeId, userId, shopId, products }) {
        // check discount is available
        const foundDiscount = await discount.findOne({
            discount_code: codeId,
            discount_shopId: convertToObjectIdMongodb(shopId)
        }).lean()

        if (!foundDiscount) throw new NotFoundError(`Discount not found`)

        const {
            discount_is_active,
            discount_max_uses,
            discount_min_order_value,
            discount_max_uses_per_user,
            discount_users_used,
            discount_start_date,
            discount_end_date,
            discount_value,
            discount_max_value,
            discount_type,
        } = foundDiscount

        if (!discount_is_active) { // het han su dung
            throw new NotFoundError(`Discount expired`)
        }

        if (!discount_max_uses) { // het so luong su dung
            throw new NotFoundError(`This discount has reached its maximum usage`)
        }

        // check if was set least value?
        let totalOrder = 0
        if (discount_min_order_value > 0) {
            // get total value
            totalOrder = products.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)

            console.log(`Total order value: ${totalOrder}, Min required: ${discount_min_order_value}`);


            if (totalOrder < discount_min_order_value) {
                // gia tien tong cac san pham can toi thieu lon hon hoac bang so voi so tien toi thieu duoc giam gia
                throw new NotFoundError(`Order requires a minimum of ${discount_min_order_value}`)
            }
        }

        if (discount_max_uses_per_user > 0) {
            // neu user do da tung su dung discount nay va so luong toi da discount doi voi nguoi dung chi la 1
            const userUseDiscount = discount_users_used.find(user => user.userId === userId)
            if (userUseDiscount) {
                // user used to that discount
                throw new NotFoundError(`You have already used this discount code`)
            }
        }

        // check discount what is fixed amount or percentage
        const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100)

        return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount
        }
    }

    // delete discout code if discount code is expied
    static async deleteDiscountCode({ shopId, codeId }) {
        // ki hon thi can kiem tra discount do co dang duoc su dung o product nao hay khong
        const deleted = await discount.findOneAndDelete({
            discount_code: codeId,
            discount_shopId: convertToObjectIdMongodb(shopId)
        })

        return deleted
    }

    /*
        Cancel discount code if it contains any problem

    */

    // cancel discount code is it contains any problem
    static async cancelDiscountCode({ codeId, shopId, userId }) {
        const foundDiscount = await checkDiscountExists({
            model: discount,
            filter: {
                discount_code: codeId,
                discount_shopId: convertToObjectIdMongodb(shopId)
            }
        })

        if (!foundDiscount) throw new NotFoundError('Discount not found')

        const result = await discount.findByIdAndUpdate(foundDiscount._id, {
            $pull: {
                discount_users_used: userId
            },
            $inc: {
                discount_max_uses: 1,
                discount_uses_count: -1
            }
        })

        return result
    }
}

module.exports = DiscountService