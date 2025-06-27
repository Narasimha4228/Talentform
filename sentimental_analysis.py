# Sentimental Analysis Python Program
# This is a simple example using TextBlob for sentiment analysis
from textblob import TextBlob

def analyze_sentiment(text):
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity
    if polarity > 0:
        return 'Positive'
    elif polarity < 0:
        return 'Negative'
    else:
        return 'Neutral'

if __name__ == "__main__":
    user_input = input("Enter a statement for sentiment analysis: ")
    result = analyze_sentiment(user_input)
    print(f"Sentiment: {result}")
