const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const wrapAsync = require('../utils/Wrapasync');


router.get('/verify', wrapAsync(async (req, res, next) => {
    const { token } = req.query;
  
 
    const user = await User.findOne({ verificationToken: token });
  
    if (!user) {
      return res.status(404).json({ message: 'Invalid verification token' });
    }
  
   
    user.emailVerified = true;
    user.verificationToken = undefined;
    await user.save();
  
  
    res.redirect('/user/signin');
  }));
  
  module.exports = router;