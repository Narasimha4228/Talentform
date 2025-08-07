// backend/routes/sentiment.js
const express = require('express');
const Sentiment = require('../models/Sentiment');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware to verify JWT
function authMiddleware(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.userId = decoded.userId;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
}

// Save sentiment analysis result
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { text, sentiment } = req.body;
        const newSentiment = new Sentiment({
            user: req.userId,
            text,
            sentiment
        });
        await newSentiment.save();
        res.status(201).json({ message: 'Sentiment saved' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all sentiments for a user
router.get('/', authMiddleware, async (req, res) => {
    try {
        const sentiments = await Sentiment.find({ user: req.userId }).sort({ createdAt: -1 });
        res.json(sentiments);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
