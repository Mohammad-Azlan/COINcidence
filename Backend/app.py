from flask import Flask, jsonify
from flask_cors import CORS
from utils.twitter_helper import fetch_crypto_tweets
from utils.reddit_helper import fetch_crypto_posts
from utils.coingecko_helper import get_crypto_price
from models.sentiment_model import analyze_sentiment
import pickle
import os

# ---------------------------
# Flask Setup
# ---------------------------
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})


# ---------------------------
# Load ML model (optional)
# ---------------------------
model_path = os.path.join("models", "crypto_sentiment_model.pkl")
crypto_model = None
if os.path.exists(model_path):
    with open(model_path, "rb") as f:
        crypto_model = pickle.load(f)
    print("✅ ML model loaded successfully.")
else:
    print("⚠️ No trained ML model found. Running in sentiment-only mode.")

# ---------------------------
# API Routes
# ---------------------------
@app.route("/")
def home():
    return jsonify({"message": "🚀 Crypto Sentiment API running successfully!"})


@app.route("/api/crypto/<coin_id>", methods=["GET"])
def crypto_info(coin_id):
    coin_id = coin_id.lower().strip()
    print(f"🔍 Fetching data for: {coin_id}")

    try:
        # --- Fetch Data ---
        tweets = fetch_crypto_tweets(coin_id) or []
        reddit_posts = fetch_crypto_posts(coin_id) or []
        price_data = get_crypto_price(coin_id) or {}

        if not tweets and not reddit_posts:
            return jsonify({"error": "No data found for this crypto."}), 404

        # --- Sentiment Analysis ---
        reddit_sentiments = [analyze_sentiment(p.get("title", "")) for p in reddit_posts]
        avg_reddit = (
            sum(s.get("combined_score", 0) for s in reddit_sentiments) / len(reddit_sentiments)
            if reddit_sentiments else 0
        )

        tweet_sentiments = [analyze_sentiment(t.get("text", "")) for t in tweets]
        avg_tweet = (
            sum(s.get("combined_score", 0) for s in tweet_sentiments) / len(tweet_sentiments)
            if tweet_sentiments else 0
        )

        combined_sentiment = (avg_reddit + avg_tweet) / 2 if (avg_reddit or avg_tweet) else 0

        # --- ML Model Prediction ---
        prediction, confidence = None, None
        if crypto_model and "price" in price_data:
            try:
                features = [[price_data["price"], combined_sentiment, price_data.get("change_24h", 0)]]
                prediction = int(crypto_model.predict(features)[0])
                if hasattr(crypto_model, "predict_proba"):
                    confidence = float(crypto_model.predict_proba(features)[0].max())
            except Exception as e:
                print(f"⚠️ ML prediction error: {e}")

        # --- Summary ---
        summary = (
            "📈 Mostly positive sentiment — potential upward trend."
            if combined_sentiment > 0.05 else
            "📉 Mostly negative sentiment — possible dip ahead."
            if combined_sentiment < -0.05 else
            "⚖️ Neutral sentiment — market uncertain."
        )

        # --- Most Popular Posts ---
        popular_reddit_post = max(reddit_posts, key=lambda x: x.get("score", 0), default=None)
        popular_tweet = max(tweets, key=lambda x: x.get("like_count", 0), default=None)

        # --- Construct Response ---
        return jsonify({
            "crypto": coin_id,
            "price_usd": price_data.get("price"),
            "average_sentiment": round(combined_sentiment, 3),
            "prediction": prediction,
            "confidence": confidence,
            "summary": summary,
            "reddit": {
                "average_sentiment": round(avg_reddit, 3),
                "most_popular_post": popular_reddit_post
            },
            "twitter": {
                "average_sentiment": round(avg_tweet, 3),
                "most_popular_tweet": popular_tweet
            },
            "counts": {
                "reddit_posts": len(reddit_posts),
                "tweets": len(tweets)
            }
        })

    except Exception as e:
        print("❌ Server error:", e)
        return jsonify({"error": str(e)}), 500


# ---------------------------
# Run App
# ---------------------------
if __name__ == "__main__":
    app.run(debug=True)
