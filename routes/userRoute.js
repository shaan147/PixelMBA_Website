const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const User = mongoose.model('User');
const wrapAsync = require('../utils/Wrapasync');
const crypto = require('crypto');
const Mailjet = require('node-mailjet');
const mailjet = Mailjet.apiConnect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE);


router.get('/user/signup', (req, res) => {
  res.render('./admin/signup');
});

// Function to generate a unique verification token
function generateVerificationToken() {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(20, (err, buf) => {
      if (err) {
        reject(err);
      } else {
        const token = buf.toString('hex');
        resolve(token);
      }
    });
  });
}
// user sign in page route
router.get('/user/signin', (req, res) => {
  res.render('./user_pages/signin');
});
const logCredentials = (req, res, next) => {
  console.log('Attempting login with email:', req.body.email);
  console.log('Attempting login with pass:', req.body.password);
  next();
};
// user login route

router.post('/user/login', logCredentials, passport.authenticate('user', {
  failureRedirect: '/user/signin',
  failureFlash: { type: 'error', message: 'Invalid Username/Password' }
}), (req, res) => {
  console.log('User logged in:', req.body.email);
  req.flash('success', 'We are glad you are back');

  res.redirect('/grid');
});

// user signup route
router.post('/usersignup', wrapAsync(async (req, res, next) => {
  const { email, password } = req.body;
  console.log('User signed up:', email, password);
  const foundUser = await User.findOne({ email }); 

  if (foundUser) {
    req.flash('error', 'Email already in use. Try a different email or log in instead.');
    return res.redirect('/');
  }

  const verificationToken = await generateVerificationToken();
  

  const user = new User({ ...req.body, verificationToken });
 
  // Use 'register' method to handle password hashing and saving to the database
  const registeredUser= User.register(user, password,async function (err, newUser) {
    if (err) {
      return next(err);
    }
  
    const verificationLink = `http://localhost:3000/verify?token=${verificationToken}`;

    // Create an email data object for sending the verification link
    const emailData = {
      FromEmail: 'jms.bandeira@hotmail.com',
      FromName: 'PixelMBA',
      Recipients: [
        {
          Email: email,
          Name: 'User',
        },
      ],
      Subject: 'Verify Your Email',
      TextPart: `Click on the link to verify your email: ${verificationLink}`,
      HTMLPart: `
        <h3>Verify Your Email</h3>
        <p style="font-size: 16px; color: #333;">Hello,</p>
        <p style="font-size: 16px; color: #333;">Click on the link below to verify your email:</p>
        <a href="${verificationLink}" target="_blank">${verificationLink}</a>
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
    res.redirect('/user/signin');
  });
}));
// Logout Route
router.get('/user/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});


module.exports = router;
