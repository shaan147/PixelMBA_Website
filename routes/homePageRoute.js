const express = require('express');
const router = express.Router();



router.get('/', async (req, res) => {  

    res.render('./user_pages/home');
});

router.get('/grid', async (req, res) => {
    res.render('./user_pages/grid');
  });
module.exports = router;