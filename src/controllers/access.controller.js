'use strict';

const { OK, CREATED, SuccessResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");


class AccessController {

    handlerRefreshToken = async(req, res, next) => {
        new SuccessResponse({
            message: 'get token successfully!',
            metadata: await AccessService.handleRefreshTokenV2({
                refreshToken: req.refreshToken,
                user: req.user,
                keyStore: req.keyStore
            })
        }).send(res)
    }

    logout = async(req, res, next) => {
        new SuccessResponse({
            message: 'Logout successfully!',
            metadata: await AccessService.logout(req.keyStore)
        }).send(res)
    }

    login = async(req, res, next) => {
        new SuccessResponse({
            metadata: await AccessService.login(req.body)
        }).send(res)
    }

    // sign up controller
    signUp = async(req, res, next) => {
        new CREATED({
            message: 'Registered OK!',
            metadata: await AccessService.signUp(req.body),
            options: {
                limit: 10
            }
        }).send(res)
    };
}

module.exports = new AccessController();