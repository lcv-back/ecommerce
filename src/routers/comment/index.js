'use strict'

const express = require('express')
const router = express.Router()
const CommentController = require('../../controllers/comment.controller')
const asyncHandler = require('../../helpers/asyncHandler')
const { authenticationV2 } = require('../../auth/authUtils')

// authentication
//router.use(authenticationV2)

router.post('', asyncHandler(CommentController.createComment))

router.get('', asyncHandler(CommentController.getCommentsByParentId))

module.exports = router