const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Animal = require('../models/animal');
const {isLoggedIn, validateAnimal, isAuthor} = require('../middleware');




router.get('/', catchAsync(async(req, res) => {
    const animals = await Animal.find({});
    res.render('animals/index', {animals});
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('animals/new');
});

router.post('/', isLoggedIn, validateAnimal, catchAsync(async(req, res) => {
    // if (!req.body.animal) throw new ExpressError('Invalid AnimalConfig')
    const animal = new Animal(req.body.animal);
    animal.author = req.user._id;
    await animal.save();
    req.flash('success', 'Animal Added!');
    res.redirect(`/animals/${animal._id}`);
}));

router.get('/:id', catchAsync(async(req, res) => {
    const animal = await Animal.findById(req.params.id).populate({
        path: 'comments',
        populate: {
            path: 'author'
        }}).populate('author');
    if(!animal){
        req.flash('error', 'Animal Not Found!');
        return res.redirect('/animals');
    };
    res.render('animals/show', {animal});
}));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async(req, res) => {
    const animal = await Animal.findById(req.params.id);
    if(!animal){
        req.flash('error', 'Animal Not Found!');
        return res.redirect('/animals');
    };
    res.render('animals/edit', {animal});
}));

router.put('/:id', isLoggedIn, isAuthor, validateAnimal, catchAsync(async(req, res) => {
    const { id } = req.params;
    const animal = await Animal.findByIdAndUpdate(id, { ...req.body.animal});
    res.redirect(`/animals/${animal._id}`);
}));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async(req, res) => {
    const { id } = req.params;
    await Animal.findByIdAndDelete(id);
    req.flash('success', 'Animal Deleted!');
    res.redirect('/animals');
}));


module.exports = router;