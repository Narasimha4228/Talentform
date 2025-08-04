# Sentimental Analysis Report

## Overview
This project analyzes social media and airline review data to predict sentiment (positive, negative, neutral) using machine learning. It combines custom datasets and advanced text preprocessing to improve accuracy, especially for nuanced statements.

## Features
- Sentiment analysis for social media and airline reviews
- Handles negations and nuanced language
- Uses scikit-learn, pandas, and NLTK for data processing and modeling
- Flask backend for API integration
- Customizable datasets for training

## Project Structure
- `backend/` — Python backend with model training and prediction logic
- `css/`, `js/` — Frontend assets
- `*.html` — Web interface files

## Setup Instructions
1. Clone the repository
2. Install Python dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```
3. Ensure NLTK data is downloaded (the script will attempt this automatically)
4. Run the backend:
   ```bash
   python backend/sentiment.py
   ```

## Usage
- The backend script will train the model and print evaluation metrics
- You can test predictions by editing the sample texts in `sentiment.py`
- Integrate with a web frontend or API as needed

## Customization
- Add more data to `CustomTweets.csv` or `CustomGeneralSentiment.csv` for improved accuracy
- Adjust preprocessing in `sentiment.py` for domain-specific needs

## License
MIT License
