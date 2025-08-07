# backend/sentiment_api.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import traceback
import sentiment

app = Flask(__name__)
CORS(app)

@app.route('/api/sentiment', methods=['POST'])
def analyze_sentiment():
    try:
        data = request.get_json()
        text = data.get('text', '')
        if not text:
            return jsonify({'error': 'No text provided'}), 400
        result = sentiment.predict_sentiment(text)
        return jsonify({'sentiment': result})
    except Exception as e:
        return jsonify({'error': str(e), 'trace': traceback.format_exc()}), 500

@app.route('/api/sentiment', methods=['GET'])
def sentiment_get():
    return jsonify({'message': 'API is running. Use POST to analyze sentiment.'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
