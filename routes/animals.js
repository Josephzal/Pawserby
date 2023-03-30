const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const animals = require('../controllers/animals')
const {isLoggedIn, validateAnimal, isAuthor} = require('../middleware');


router.route('/')
    .get(catchAsync(animals.index))
    .post(isLoggedIn, validateAnimal, catchAsync(animals.createAnimal))

// Must come before put
router.get('/new', isLoggedIn, animals.renderNewForm);

router.route('/:id')
    .get(catchAsync(animals.showAnimal))
    .put(isLoggedIn, isAuthor, validateAnimal, catchAsync(animals.updateAnimal))
    .delete(isLoggedIn, isAuthor, catchAsync(animals.deleteAnimal))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(animals.renderEditForm));


module.exports = router;