# Import required libraries
import pandas as pd
import numpy as np
import re
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score
from sklearn.pipeline import Pipeline
from sklearn.naive_bayes import MultinomialNB
import os
import requests

# Download NLTK resources
nltk.download('stopwords')
nltk.download('wordnet')
nltk.download('omw-1.4')

# Use custom dataset for training
DATASET_PATH = "CustomTweets.csv"
DATASET_URL = "https://raw.githubusercontent.com/kolaveridi/kaggle-Twitter-US-Airline-Sentiment/master/Tweets.csv"
def download_dataset():
    import time
    max_retries = 3
    for attempt in range(max_retries):
        print(f"Attempt {attempt+1} to download dataset...")
        try:
            r = requests.get(DATASET_URL, timeout=30)
            if r.status_code == 200 and r.content and len(r.content) > 1000:
                with open(DATASET_PATH, 'wb') as f:
                    f.write(r.content)
                print(f"Downloaded '{DATASET_PATH}'.")
                return True
            else:
                print(f"Failed to download (status {r.status_code}, size {len(r.content)}). Retrying...")
        except Exception as e:
            print(f"Download error: {e}. Retrying...")
        time.sleep(2)
    print(f"Failed to download dataset after {max_retries} attempts. Please download manually from {DATASET_URL} and place as '{DATASET_PATH}'.")
    return False

if not os.path.exists(DATASET_PATH):
    print(f"'{DATASET_PATH}' not found. Downloading from {DATASET_URL} ...")
    if not download_dataset():
        raise FileNotFoundError(
            f"Failed to download dataset from {DATASET_URL}. "
            f"Please download it manually and place it as '{DATASET_PATH}'."
        )

# Use both airline and general sentiment datasets
import glob

def load_datasets():
    dfs = []
    # Load main airline dataset
    if os.path.exists("CustomTweets.csv"):
        dfs.append(pd.read_csv("CustomTweets.csv", on_bad_lines='skip'))
    # Load general sentiment dataset
    if os.path.exists("CustomGeneralSentiment.csv"):
        dfs.append(pd.read_csv("CustomGeneralSentiment.csv", on_bad_lines='skip'))
    if not dfs:
        raise FileNotFoundError("No sentiment datasets found.")
    return pd.concat(dfs, ignore_index=True)

df = load_datasets()

# Preprocessing function
def preprocess_text(text):
    # Convert to lowercase first
    text = text.lower()
    # Handle negations by joining not/never with the next word
    text = re.sub(r'\b(?:not|never)\b\s+(\w+)', r'not_\1', text)
    # Remove special characters and numbers, but keep underscores for negations
    text = re.sub(pattern=r'[^a-zA-Z_\s]', repl='', string=text, flags=re.I|re.A)
    # Tokenize
    tokens = text.split()
    # Remove stopwords except 'not' and 'never'
    stop_words = set(stopwords.words('english'))
    tokens = [token for token in tokens if token not in stop_words]
    # Lemmatization
    lemmatizer = WordNetLemmatizer()
    tokens = [lemmatizer.lemmatize(token) for token in tokens]
    return ' '.join(tokens)

# Apply preprocessing
df['processed_text'] = df['text'].apply(preprocess_text)

# Clean and map sentiment labels
# Ensure all labels are lowercase and stripped

df['airline_sentiment'] = df['airline_sentiment'].astype(str).str.strip().str.lower()
y = df['airline_sentiment'].map({'negative':0, 'neutral':1, 'positive':2})
# Drop rows with NaN in y (unrecognized label)
mask = y.notna()
X = df.loc[mask, 'processed_text']
y = y[mask]

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Create pipeline with TF-IDF and classifier
model = Pipeline([
    ('tfidf', TfidfVectorizer(ngram_range=(1,2), max_features=5000)),
    ('clf', LogisticRegression(
        multi_class='multinomial', 
        solver='lbfgs', 
        max_iter=1000,
        class_weight='balanced'
    ))
])

# Train model
model.fit(X_train, y_train)

# Evaluate model
y_pred = model.predict(X_test)
print("Model Accuracy:", accuracy_score(y_test, y_pred))
print("\nClassification Report:")
print(classification_report(y_test, y_pred, target_names=['negative', 'neutral', 'positive']))

# Prediction function
def predict_sentiment(text):
    processed = preprocess_text(text)
    prediction = model.predict([processed])[0]
    sentiment_map = {0: 'negative', 1: 'neutral', 2: 'positive'}
    return sentiment_map[prediction]

# Test with sample statements
sample_texts = [
    "This flight was amazing!",
    "The service was terrible.",
    "We landed at 5 PM.",
    "The food was okay but the staff was great",
    "I will never fly with this airline again",
    "mohan is good student",
    "The experience was bad.",
    "The experience was average.",
    "The experience was excellent.",
    "The staff was not helpful.",
    "The food was not tasty.",
    "The flight was not enjoyable."
]

print("\n--- Sentiment Predictions ---\n")
for text in sample_texts:
    try:
        sentiment = predict_sentiment(text)
        print(f"Text: {text}\nPredicted Sentiment: {sentiment}\n{'-'*40}")
    except Exception as e:
        print(f"Text: {text}\nError: {e}\n{'-'*40}")