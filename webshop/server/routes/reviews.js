// Description: This file contains the routes for handling product reviews in the webshop application.
const express = require('express');
const Review = require('../models/Review');
const User = require('../models/User');
const Product = require('../models/Product');
const router = express.Router();

// Get all reviews for a product
router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'firstName lastName email');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Post a new review
router.post('/', async (req, res) => {
  try {
    const { product, user, guestName, rating, text } = req.body;
    if (!product || !rating || !text) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    if (!user && !guestName) {
      return res.status(400).json({ error: 'Guest name required for anonymous review' });
    }
    const review = new Review({
      product,
      user: user || null,
      guestName: user ? undefined : guestName,
      rating,
      text
    });
    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: 'Failed to post review' });
  }
});

module.exports = router;