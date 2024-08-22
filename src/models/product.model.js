'use strict'

// key !dmbg install by Mongo Snippets for Node-js

const {
    model,
    Schema
} = require('mongoose'); // Erase if already required
const slugify = require('slugify')

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

const productSchema = new Schema({
    product_name: {
        type: String,
        required: true
    },
    product_thumb: {
        type: String,
        required: true
    },
    product_description: {
        type: String
    },
    product_slug: {
        type: String
    },
    product_price: {
        type: Number,
        required: true
    },
    product_quantity: {
        type: Number,
        required: true
    },
    product_type: {
        type: String,
        required: true,
        enum: ['Electronics', 'Clothing', 'Furniture']
    },
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    },
    product_attributes: {
        type: Schema.Types.Mixed,
        required: true
    },
    product_ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be above 5.0'],
        // around
        set: (val) => Math.round(val * 10) / 10
    },
    product_variations: {
        type: Array,
        default: []
    },
    isDraft: {
        type: Boolean,
        default: true,
        index: true,
        select: false
    },
    isPublished: {
        type: Boolean,
        default: false,
        index: true,
        select: false
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
})

// document middeware: run before .save() .create()
productSchema.pre('save', function(next) {
    this.product_slug = slugify(this.product_name, {
            lower: true,
            remove: /[*+~.()'"!:@]/g, // Remove special characters
            locale: 'vi' // Set locale to Vietnamese
        }) // convert product_name to product_slug
    next();
})

// create the model

// define the product type = clothing
const clothingSchema = new Schema({
    brand: {
        type: String,
        required: true
    },
    size: String,
    material: String,
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    }
}, {
    collection: 'clothes',
    timestamps: true
})

// define the product type = electronic
const electronicSchema = new Schema({
    manufacturer: {
        type: String,
        required: true
    },
    model: String,
    color: String,
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    }
}, {
    collection: 'electronics',
    timestamps: true
})

// define the product type = furniture
const furnitureSchema = new Schema({
    brand: {
        type: String,
        required: true
    },
    size: String,
    material: String,
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    }
}, {
    collection: 'furnitures',
    timestamps: true
})

module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    clothing: model('Clothing', clothingSchema),
    electronic: model('Electronics', electronicSchema),
    furniture: model('Furnitures', furnitureSchema)
}