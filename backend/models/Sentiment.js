// backend/models/Sentiment.js
const mongoose = require('mongoose');

const SentimentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: { type: String, required: true },
    sentiment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Sentiment', SentimentSchema);
