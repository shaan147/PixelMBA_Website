const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {  

    res.render('./user_pages/home');
});

router.get('/grid', async (req, res) => {
    res.render('./user_pages/grid');
  });

  router.get('/signup', async (req, res) => {
    res.render('./user_pages/signup');
  });

  router.get('/signin', async (req, res) => {
    res.render('./user_pages/signin');
  });
  
module.exports = router;