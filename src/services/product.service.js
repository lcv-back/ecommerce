'use strict'

const { product, clothing, electronic } = require('../models/product.model')
const { BadRequestError, ForbiddenError } = require('../core/error.response')

// polymorphic pattern

// define Factory class to create product
class ProductFactory {
    /*
        type: 'Clothing',
        payload
    */

    static async createProduct(type, payload) {
        switch (type) {
            case 'Electronic':
                return new Electronics(payload)

            case 'Electronic':
                return new Clothing(payload).createProduct()

            default:
                throw new BadRequestError(`Invalid Product Type: ${type}`)
        }
    }
}

// define base product class
class Product {
    constructor({
        product_name,
        product_thumb,
        product_description,
        product_price,
        product_quantity,
        product_type,
        product_shop,
        product_attributes
    }) {
        this.product_name = product_name
        this.product_thumb = product_thumb
        this.product_description = product_description
        this.product_price = product_price
        this.product_quantity = product_quantity
        this.product_type = product_type
        this.product_shop = product_shop
        this.product_attributes = product_attributes
    }

    // create new product
    async createProduct() {
        return await product.create(this)
    }
}

// define sub-class for different product types Clothing
class Clothing extends Product {
    async createProduct() {
        const newClothing = new clothing.create(this.product_attributes)
        if (!newClothing) throw new BadRequestError('Create new clothing failed')

        const newProduct = await super.createProduct()
        if (!newProduct) throw new BadRequestError('Create new product failed')

        return newProduct
    }
}

// define sub-class for different product types Clothing
class Electronics extends Product {
    async createProduct() {
        const newElectronic = new electronic.create(this.product_attributes)
        if (!newElectronic) throw new BadRequestError('Create new electronic failed')

        const newProduct = await super.createProduct()
        if (!newProduct) throw new BadRequestError('Create new product failed')

        return newProduct
    }
}

module.exports = ProductFactory