// routes/pixelRoute.js
const express = require('express');
const router = express.Router();
const Pixel = require('../models/pixel');
const multer = require('multer');
const { storage } = require('../cloudinary/index');
const upload = multer({ storage });

router.post('/submit_pixel', upload.single('image'), async (req, res) => {
    try {
      const { pixelUrl, pixelColor, pixelIndex} = req.body;
      const image = req.file ? req.file.path : '';
 
      // Create a new Pixel document
      const newPixel = new Pixel({
        pixelUrl,
        image,
        pixelColor,
        pixelIndex,
      });
     // Check if the user is logged in
     if (req.isAuthenticated()) {
        newPixel.buyer = {
          email: req.user.email,
          userId: req.user._id,
        };
      }
      // Save the Pixel document to the database
      await newPixel.save();

      req.flash('success', 'Pixel submitted successfully');
      res.redirect('/grid'); // Redirect to a success page or adjust accordingly
    } catch (error) {
      console.error('Error submitting Pixel:', error);

      req.flash('error', 'Error submitting Pixel');
      res.status(500).json({ message: 'Error submitting Pixel', error: error.message });
    }
});


module.exports = router;
