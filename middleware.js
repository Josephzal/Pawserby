const { animalSchema, commentSchema } = require('./schema.js');
const ExpressError = require('./utils/ExpressError');
const Animal = require('./models/animal');
const Comment = require('./models/comment');

module.exports.isLoggedIn = (req, res, next) => { 
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'Must be signed in');
        return res.redirect('/login')
    }
    next();
};

module.exports.isAuthor = async(req, res, next) => {
    const { id } = req.params;
    const animal = await Animal.findById(id);
    if (!animal.author.equals(req.user._id)) {
        req.flash('error', "You don't have permission to do that!");
        return res.redirect(`/animals/${id}`)
    };
    next();
};

module.exports.isCommentAuthor = async(req, res, next) => {
    const { id, commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment.author.equals(req.user._id)) {
        req.flash('error', "You don't have permission to do that!");
        return res.redirect(`/animals/${id}`)
    };
    next();
};

module.exports.validateAnimal = (req, res, next) => {
    const { error } = animalSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join('');
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
};

module.exports.validateComment = (req, res, next) => {
    const { error } = commentSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join('');
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
};