const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_TEST_SECRET_KEY);
const Pixel = require('../models/pixel');
const PixelGoal = require('../models/total_pixel');
const User = require('../models/user');

router.post('/create-checkout-session', async (req, res) => {
    try {
      const { quantity } = req.body;
  
      // Fetch the total pixels information from the database
      const pixelGoal = await PixelGoal.findOne();
  
      if (!pixelGoal) {
        return res.status(404).json({ message: 'Pixels not found' });
      }
      if (!req.user) {
        return res.redirect('/user/signin');
    }
    const userId = req.user._id;

      // Calculate the unit amount based on the price per pixel (€10)
      const unitAmount = 10 * 100; // Convert to cents
  
      // Create a Checkout Session
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: 'Pixel', // You can adjust this based on your product details
              },
              unit_amount: unitAmount,
            },
            quantity: quantity || 1,
          },
        ],
        mode: 'payment',
        success_url: `http://localhost:3000/success?userId=${userId}`,
        cancel_url: 'http://localhost:3000/cancel',
      });
     
      res.redirect(303, session.url);
    } catch (error) {
      console.error('Error creating Checkout Session:', error);
      res.status(500).json({ message: 'Error creating Checkout Session', error: error.message });
    }
  });

  router.get('/success', async (req, res) => {
    try {
      const { userId } = req.query;
  
      // Update the User document to increment the pixelsBoughtCount
      await User.updateOne({ _id: userId }, { $inc: { pixelsBoughtCount: 1 } });
  
      // Decrement the totalPixels in PixelGoal
      await PixelGoal.updateOne({}, { $inc: { totalPixels: -1 } });
  
      res.render('./user_pages/success'); // Render your success page
    } catch (error) {
      console.error('Error updating database on success:', error);
      res.status(500).json({ message: 'Error updating database on success', error: error.message });
    }
  });


module.exports = router;
