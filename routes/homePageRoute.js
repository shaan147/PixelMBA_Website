const express = require('express');
const router = express.Router();
const { ensureAuthenticated }  = require('../middleware/isUser');



router.get('/', async (req, res) => {  

    res.render('./user_pages/home');
});

router.get('/grid', ensureAuthenticated, async (req, res) => {
    res.render('./user_pages/grid');
  });

  router.get('/signup', async (req, res) => {
    res.render('./user_pages/signup');
  });

  
module.exports = router;