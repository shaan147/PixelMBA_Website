const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const user = require('../models/user');

router.get('/', async (req, res) => {  
    res.render('./user_pages/home');
});

router.get('/grid', async (req, res) => {
  res.render('./user_pages/grid', { user: req.user }); 
  });

  router.get('/signup', async (req, res) => {
    res.render('./user_pages/signup');
  });

  router.get('/signin', async (req, res) => {
    res.render('./user_pages/signin');
  });
  
module.exports = router;