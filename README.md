# COINcidence 🚀

**COINcidence** is a real-time cryptocurrency sentiment analysis and prediction platform. It fetches live data from Reddit, Twitter, and CoinGecko, analyzes sentiment trends using VADER (and optionally a trained ML model), and provides actionable insights for crypto enthusiasts.  

---

## Features

- 📈 **Live Crypto Prices**: Fetches current price and 24-hour price changes using CoinGecko API.  
- 🐦 **Twitter Sentiment Analysis**: Fetches recent crypto-related tweets and calculates sentiment scores.  
- 👨‍💻 **Reddit Sentiment Analysis**: Fetches hot posts from relevant subreddits and computes sentiment.  
- 🤖 **ML-Based Predictions**: Optionally predicts crypto movement using a trained machine learning model.  
- 📝 **Popular Posts Identification**: Highlights the most popular tweet and Reddit post for a crypto.  
- ⚖️ **Market Summary**: Provides a simple summary of market sentiment: positive, negative, or neutral.  

---

## Technologies Used

- **Backend**: Python, Flask  
- **APIs**: CoinGecko, Reddit (public), Twitter (Tweepy v2)  
- **Sentiment Analysis**: VADER SentimentIntensityAnalyzer  
- **Machine Learning (Optional)**: Pickle-trained model for crypto prediction  
- **CORS**: Flask-CORS for frontend integration  

---

