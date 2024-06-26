'use strict';

const keytokenModel = require("../models/keytoken.model");

// create token

class KeyTokenService {
    static createKeyToken = async({ userId, publicKey }) => {
        // why to to string public key? because publickey was generated from symmetric-key algorithms (thuat toan bat doi xung) is buffer
        // so we need to convert to string to store in database if not then occur error

        try {
            const publicKeyString = publicKey.toString();

            const tokens = await keytokenModel.create({
                user: userId,
                publicKey: publicKeyString
            });

            if (tokens) return publicKeyString;
            return null;

        } catch (error) {
            return error;
        }
    };
}

module.exports = KeyTokenService;