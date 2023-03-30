const Animal = require('../models/animal');

module.exports.index = async(req, res) => {
    const animals = await Animal.find({});
    res.render('animals/index', {animals});
};

module.exports.renderNewForm = (req, res) => {
    res.render('animals/new');
};

module.exports.createAnimal = async(req, res) => {
    // if (!req.body.animal) throw new ExpressError('Invalid AnimalConfig')
    const animal = new Animal(req.body.animal);
    animal.author = req.user._id;
    await animal.save();
    req.flash('success', 'Animal Added!');
    res.redirect(`/animals/${animal._id}`);
};

module.exports.showAnimal = async(req, res) => {
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
};

module.exports.renderEditForm = async(req, res) => {
    const animal = await Animal.findById(req.params.id);
    if(!animal){
        req.flash('error', 'Animal Not Found!');
        return res.redirect('/animals');
    };
    res.render('animals/edit', {animal});
};

module.exports.updateAnimal = async(req, res) => {
    const { id } = req.params;
    const animal = await Animal.findByIdAndUpdate(id, { ...req.body.animal});
    res.redirect(`/animals/${animal._id}`);
};

module.exports.deleteAnimal = async(req, res) => {
    const { id } = req.params;
    await Animal.findByIdAndDelete(id);
    req.flash('success', 'Animal Deleted!');
    res.redirect('/animals');
};