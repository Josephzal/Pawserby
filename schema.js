const Joi = require('Joi');

module.exports.animalSchema = Joi.object({
    animal: Joi.object({
        species: Joi.string().required(),
        image: Joi.string().required(),
        location: Joi.string().required(),
        name: Joi.string().allow('').optional(),
        description: Joi.string().required()
    }).required()
});

module.exports.commentSchema = Joi.object({
    comment: Joi.object({
        user: Joi.string().required(),
        body: Joi.string().required()
    }).required()
});