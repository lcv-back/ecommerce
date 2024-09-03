'use strict';

const {
    BadRequestError,
    NotFoundError
} = require('../core/error.response')

const discount = require('../models/discount.model');
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

        // kiem tra
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
}