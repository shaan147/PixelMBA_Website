const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const wrapAsync = require('../utils/Wrapasync');
// Add this route to your existing routes
router.get('/verify', wrapAsync(async (req, res, next) => {
    const { token } = req.query;
  
    // Find the user by the verification token
    const user = await User.findOne({ verificationToken: token });
  
    if (!user) {
      return res.status(404).json({ message: 'Invalid verification token' });
    }
  
    // Update the user's document to mark the email as verified
    user.emailVerified = true;
    user.verificationToken = undefined;
    await user.save();
  
    // Redirect to the /grid page
    res.redirect('/grid');
  }));
  
  module.exports = router;