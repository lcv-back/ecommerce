'use strict';

const { Types, mongoose } = require("mongoose");

// const { default: mongoose } = require("mongoose");
const keytokenModel = require("../models/keytoken.model");


// create token

class KeyTokenService {
    static createKeyToken = async({ userId, publicKey, privateKey, refreshToken }) => {
        // why to to string public key? because publickey was generated from symmetric-key algorithms (thuat toan bat doi xung) is buffer
        // so we need to convert to string to store in database if not then occur error

        try {
            const filter = { user: userId },
                update = {
                    publicKey,
                    privateKey,
                    refreshTokensUsed: [],
                    refreshToken
                },
                options = { upsert: true, new: true }
            const tokens = await keytokenModel.findOneAndUpdate(filter, update, options)

            return tokens ? tokens.publicKey : null

        } catch (error) {
            return error;
        }
    };

    static findByUserId = async(userId) => {
        return await keytokenModel.findOne({ user: userId }).lean()
    }

    static removeKeyById = async(id) => {
        return await keytokenModel.deleteOne(id)
    }
}

module.exports = KeyTokenService;