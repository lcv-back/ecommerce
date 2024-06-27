'use strict'

const { findById } = require("../services/apikey.service")

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization'
}


const apiKey = async(req, res, next) => {
    try {
        if (!req.headers[HEADER.API_KEY]) {
            console.log(`API key ${req.headers[HEADER.API_KEY]} not found`)
        }

        const key = req.headers[HEADER.API_KEY].toString()

        if (!key) {
            return res.status(403).json({
                message: 'Forbidden Error'
            })
        }

        // check objKey
        const objKey = await findById(key)

        if (!objKey) {
            return res.status(403).json({
                message: 'Forbidden Error'
            })
        }

        req.objKey = objKey

        return next()

    } catch (error) {
        return error
    }
}

const permission = (permission) => {
    return (req, res, next) => {
        if (!req.objKey.permissions) {
            return res.status(403).json({
                message: 'Permission Denied'
            })
        }

        console.log(`Permission::`, req.objKey.permissions);

        const validPermission = req.objKey.permissions.includes(permission)

        if (!validPermission) {
            return res.status(403).json({
                message: 'Permission Invalid'
            })
        }

        return next()
    }
}

// async handle
const asyncHandler = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next)
    }
}

module.exports = {
    apiKey,
    permission,
    asyncHandler
}