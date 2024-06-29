'use strict';

const express = require('express');
const accessController = require('../../controllers/access.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const router = express.Router();

// sign up
router.post('/shop/signup', asyncHandler(accessController.signUp));
// log in
router.post('/shop/login', asyncHandler(accessController.login));

// authentication
router.use(authentication)

// log out
router.post('/shop/logout', asyncHandler(accessController.logout));

// handle refresh token
router.post('/shop/handlerRefreshToken', asyncHandler(accessController.handlerRefreshToken));

module.exports = router;