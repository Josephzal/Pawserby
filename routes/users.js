const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', catchAsync(async(req, res, next) =>{
    try {
        const {username, password, email} = req.body;
        const user = new User({email, username});
        registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err){
                return next(err);
                
            }
            req.flash('success', 'Welcome to Pawserby!');
            res.redirect('/animals');
        });
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login', keepSessionInfo: true}), (req, res) => {
    req.flash('success', 'Welcome Back!');
    const redirectUrl = req.session.returnTo || '/animals';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
});

router.get('/logout', (req, res, next) => {
    req.logout(function(err) {
      if (err) { return next(err); }
      req.flash('success', "Goodbye!");
      res.redirect('/animals');
    });
  }); 

module.exports = router;