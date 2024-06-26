'use strict';

// key !dmbg install by Mongo Snippets for Node-js

const {
    model,
    Schema,
    Types
} = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Shop';
const COLLECTION_NAME = 'Shops';

// Declare the Schema of the Mongo model
var shopSchema = new Schema({
    name: {
        type: String,
        trim: true,
        maxLength: 150
    },
    email: {
        type: String,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        debugger: 'inactive',
    },
    verify: {
        type: Schema.Types.Boolean,
        debugger: false
    },
    roles: {
        type: Array,
        default: []
    },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, shopSchema);