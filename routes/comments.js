const express = require('express');
const router = express.Router({mergeParams: true});

const Animal = require('../models/animal');
const Comment = require('../models/comment');

const { commentSchema } = require('../schema.js');

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');


const validateComment = (req, res, next) => {
    const { error } = commentSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join('');
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
};


router.post('/', validateComment, catchAsync(async (req, res) => {
    const animal = await Animal.findById(req.params.id);
    const comment = new Comment(req.body.comment);
    animal.comments.push(comment);
    await comment.save();
    await animal.save();
    req.flash('success', 'Comment Added!');
    res.redirect(`/animals/${animal._id}`);
}));

router.delete('/:commentId', catchAsync(async (req, res) => {
    const { id, commentId } = req.params;
    // remove comment from array in mongo
    await Animal.findByIdAndUpdate(id, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId);
    req.flash('success', 'Comment Deleted!');
    res.redirect(`/animals/${id}`);
}));

module.exports = router;