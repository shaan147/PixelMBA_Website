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
module.exports = router;