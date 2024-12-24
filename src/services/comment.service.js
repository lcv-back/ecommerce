'use strict';

const Comment = require('../models/comment.model');
const { convertToObjectIdMongodb } = require('../utils');
const { NotFoundError } = require('../core/error.response');
const { findProduct } = require('../models/repositories/product.repo');

class CommentService {

    /**
     * key features:
     * - add comment [User | Shop]
     * - get a list of comments [User | Shop]
     * - delete a comment [User | Shop | Admin]
     */

    static async createComment({
        productId,
        userId,
        content,
        parentCommentId = null
    }) {
        const comment = new Comment({
            comment_productId: productId,
            comment_userId: userId,
            comment_content: content,
            comment_parentCommentId: parentCommentId
        })

        let rightValue

        if (parentCommentId) {
            // reply comment
            const parentComment = await Comment.findById(parentCommentId)
            if (!parentComment) {
                throw new NotFoundError('Parent comment not found')
            }

            rightValue = parentComment.comment_right;

            // updateMany comments right value
            await Comment.updateMany({
                comment_productId: convertToObjectIdMongodb(productId),
                comment_right: { $gte: rightValue }
            }, {
                $inc: {
                    comment_right: 2
                }
            })

            // updateMany comments left value
            await Comment.updateMany({
                comment_productId: convertToObjectIdMongodb(productId),
                comment_left: { $gt: rightValue }
            }, {
                $inc: {
                    comment_left: 2
                }
            })
        } else {
            const maxRightValue = await Comment.findOne({
                comment_productId: convertToObjectIdMongodb(productId)
            }, 'comment_right').sort({ comment_right: -1 })

            if (maxRightValue) {
                rightValue = maxRightValue.comment_right + 1
            } else {
                rightValue = 1
            }
        }

        // insert to comment
        comment.comment_left = rightValue
        comment.comment_right = rightValue + 1

        await comment.save()

        return comment
    }

    static async getCommentsByParentId({
        productId,
        parentCommentId = null,
        limit = 50,
        offset = 0 // skip
    }) {
        if (parentCommentId) {
            const parent = await Comment.findById(parentCommentId)
            if (!parent) {
                throw new NotFoundError('Parent comment not found')
            }

            const comments = await Comment.find({
                comment_productId: convertToObjectIdMongodb(productId),
                comment_left: { $gt: parent.comment_left },
                comment_right: { $lte: parent.comment_right }
            }).select({
                comment_left: 1,
                comment_right: 1,
                comment_content: 1,
                comment_parentCommentId: 1
            }).sort({
                comment_left: 1
            })

            return comments
        }

        const comments = await Comment.find({
            comment_productId: convertToObjectIdMongodb(productId),
            comment_parentCommentId: parentCommentId
        }).select({
            comment_left: 1,
            comment_right: 1,
            comment_content: 1,
            comment_parentCommentId: 1
        }).sort({
            comment_left: 1
        })

        return comments
    }

    // delete comments
    static async deleteComment({
        commentId,
        productId
    }) {
        // check the product exists in the database
        const foundProduct = await findProduct({
            product_id: productId
        })

        if (!foundProduct) {
            throw new NotFoundError('Product not found')
        }

        // 1. xac dinh gia tri left, right cua commentId
        const comment = await Comment.findById(commentId)

        if (!comment) {
            throw new NotFoundError('Comment not found')
        }

        const leftValue = comment.comment_left
        const rightValue = comment.comment_right

        // 2. tinh chieu rong: right - left + 1
        const width = rightValue - leftValue + 1

        // 3. xoa tat ca cac comment con co left >= leftValue va right <= rightValue
        await Comment.deleteMany({
            comment_productId: convertToObjectIdMongodb(productId),
            comment_left: { $gte: leftValue, $lte: rightValue },
        })

        // 4. cap nhat gia tri left, right cac comment con co left > rightValue
        await Comment.updateMany({
            comment_productId: convertToObjectIdMongodb(productId),
            comment_right: { $gt: rightValue }
        }, {
            $inc: {
                comment_right: -width
            }
        })

        await Comment.updateMany({
            comment_productId: convertToObjectIdMongodb(productId),
            comment_left: { $gt: rightValue }
        }, {
            $inc: {
                comment_left: -width
            }
        })

        return true
    }
}

module.exports = CommentService;