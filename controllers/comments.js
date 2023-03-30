const Animal = require('../models/animal');
const Comment = require('../models/comment');

module.exports.createComment = async (req, res) => {
    const animal = await Animal.findById(req.params.id);
    const comment = new Comment(req.body.comment);
    comment.author = req.user._id;
    animal.comments.push(comment);
    await comment.save();
    await animal.save();
    req.flash('success', 'Comment Added!');
    res.redirect(`/animals/${animal._id}`);
};

module.exports.deleteComment = async (req, res) => {
    const { id, commentId } = req.params;
    // remove comment from array in mongo
    await Animal.findByIdAndUpdate(id, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId);
    req.flash('success', 'Comment Deleted!');
    res.redirect(`/animals/${id}`);
}