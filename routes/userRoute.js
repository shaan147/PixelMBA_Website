const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const User = mongoose.model('User');
const wrapAsync = require('../utils/Wrapasync');

const Mailjet = require('node-mailjet');
const mailjet = Mailjet.apiConnect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE);



router.get('/user/signup', (req, res) => {
  res.render('./admin/signup');
});

router.get('/user/signin', (req, res) => {
  res.render('./user_pages/signin');
});

router.post('/user/login', passport.authenticate('user', {
  failureRedirect: '/user/signin',
  failureFlash: { type: 'error', message: 'Invalid Username/Password' }
}), (req, res) => {
  req.flash('success', 'We’re glad you are back');

  res.redirect('/grid');
});

// Handling the new user request
router.post('/usersignup', wrapAsync(async (req, res, next) => {

  const { email } = req.body;
  // Set the password as the email
  req.body.password = email;
  const foundUser = await User.findOne({ email });

  if (foundUser) {
    // Setup flash and call it here
    req.flash('error', 'Email already in use. Try a different email or log in instead.');
    return res.redirect('/');
  }
  
  const user = new User({ ...req.body});
  const registeredUser = await User.register(user, email, async function (err, newUser) {
    if (err) {
      s
      next(err);
    }
    req.logIn(newUser, async () => {
     const verificationLink = `https://pixelmba.com/verify?userId=${newUser._id}`;

      // Create an email data object for sending the verification link
      const emailData = {
        FromEmail: 'info@pixelmba.com',
        FromName: 'PixelMBA',
        Recipients: [
          {
            Email: email,
            Name: 'User',
          },
        ],
        Subject: 'Your Magic Link',
        TextPart: `Your Magic Link: ${verificationLink}`,
        HTMLPart: `
        <h2><strong>Your Magic Link</strong></h2>
        <p style="font-size: 16px; color: #333;">Use this link to login to PixelMBA:</p>
        <a href="${verificationLink}" target="_blank">Log In</a>
        <p style="font-size: 16px; color: #333;">PixelMBA</p>
      `,
      };

      // Send the email with the verification link
      const emailRequest = mailjet
        .post('send', { version: 'v3.1' })
        .request({
          Messages: [
            {
              From: {
                Email: emailData.FromEmail,
                Name: emailData.FromName,
              },
              To: emailData.Recipients,
              Subject: emailData.Subject,
              TextPart: emailData.TextPart,
              HTMLPart: emailData.HTMLPart,
            },
          ],
        });

      await emailRequest;
      setTimeout(() => {
        res.redirect('/');
      }, 180000);
   
    });
  });
}));
// Route to verify email address
router.get('/verify', wrapAsync(async (req, res, next) => {
  const { userId } = req.query; 
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: 'Invalid user ID' });
  }

  // Log in the user
  req.logIn(user, async () => {
    user.emailVerified = true;
  
    await user.save();
    res.redirect('/grid'); 
  });
}));
router.get('/user/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});
module.exports = router;
