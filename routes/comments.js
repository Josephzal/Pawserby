const express = require('express');
const router = express.Router({mergeParams: true});
const Animal = require('../models/animal');
const Comment = require('../models/comment');
const catchAsync = require('../utils/catchAsync');
const { validateComment, isLoggedIn, isCommentAuthor } = require('../middleware');

router.post('/', isLoggedIn, validateComment, catchAsync(async (req, res) => {
    const animal = await Animal.findById(req.params.id);
    const comment = new Comment(req.body.comment);
    comment.author = req.user._id;
    animal.comments.push(comment);
    await comment.save();
    await animal.save();
    req.flash('success', 'Comment Added!');
    res.redirect(`/animals/${animal._id}`);
}));

router.delete('/:commentId', isLoggedIn, isCommentAuthor, catchAsync(async (req, res) => {
    const { id, commentId } = req.params;
    // remove comment from array in mongo
    await Animal.findByIdAndUpdate(id, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId);
    req.flash('success', 'Comment Deleted!');
    res.redirect(`/animals/${id}`);
}));

module.exports = router;