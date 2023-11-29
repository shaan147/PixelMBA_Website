const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const User = mongoose.model('User');
const wrapAsync = require('../utils/Wrapasync');

router.get('/user/signup', (req, res) => {
  res.render('./admin/signup');
});

router.get('/user/signin', (req, res) => {
  res.render('./admin/signin');
});

router.post('/user/login', passport.authenticate('user', {
  failureRedirect: '/user/signin',
  failureFlash: { type: 'error', message: 'Invalid Username/Password' }
}), (req, res) => {
  req.flash('success', 'We’re glad you are back');

  res.redirect('/');
});

// Handling the new user request
router.post('/usersignup', wrapAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const foundUser = await User.findOne({ email }); 

  if (foundUser) {
    // Setup flash and call it here
    req.flash('error', 'Email already in use. Try a different email or log in instead.');
    return res.redirect('/user/signup');
  }

  const user = new User({ ...req.body });
  const registeredUser = await User.register(user, password, function (err, newUser) {
    if (err) {
      next(err);
    }
    req.logIn(newUser, () => {
      res.redirect('/user/signin');
    });
  });
}));
router.get('/user/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});
module.exports = router;
