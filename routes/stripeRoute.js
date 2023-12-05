const stripe = require('stripe')(process.env.STRIPE_TEST_SECRET_KEY);
const express = require('express');
const router = express.Router();

