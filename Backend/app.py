from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import tweepy
import pickle
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

# ---------------------------
# Flask & Config
# ---------------------------
app = Flask(__name__)
CORS(app)

COINGECKO_URL = "https://api.coingecko.com/api/v3/simple/price"
BEARER_TOKEN = "YOURAPIKEY"  # 🔑

# ---------------------------
# Load trained ML model (optional)
# ---------------------------
try:
    with open(r"models\crypto_sentiment_model.pkl", "rb") as f:
        crypto_model = pickle.load(f)
    print("✅ ML model loaded successfully.")
except FileNotFoundError:
    crypto_model = None
    print("⚠️ No trained ML model found. Sentiment only mode active.")


# ---------------------------
# Sentiment Analysis
# ---------------------------
def analyze_sentiment(text_or_list):
    """Analyze text (or list of texts) and return average sentiment + combined score."""
    analyzer = SentimentIntensityAnalyzer()

    if isinstance(text_or_list, str):
        texts = [text_or_list]
    else:
        texts = text_or_list

    totals = {"pos": 0, "neg": 0, "neu": 0, "compound": 0}
    if not texts:
        return {"pos": 0, "neg": 0, "neu": 0, "combined_score": 0}

    for t in texts:
        s = analyzer.polarity_scores(t)
        totals["pos"] += s["pos"]
        totals["neg"] += s["neg"]
        totals["neu"] += s["neu"]
        totals["compound"] += s["compound"]

    n = len(texts)
    avg = {k: v / n for k, v in totals.items()}
    avg["combined_score"] = avg["compound"]
    return avg


# ---------------------------
# Fetch Twitter Data
# ---------------------------
import time

# Simple in-memory cache
tweet_cache = {}
CACHE_DURATION = 300
# def fetch_crypto_tweets(crypto_name):
    
#     """Fetch exactly 1 tweet using Tweepy v2 Client."""
#     try:
#         client = tweepy.Client(bearer_token=BEARER_TOKEN)
#         query = f"{crypto_name} lang:en -is:retweet"
        
#         # Twitter requires min 10 results
#         tweets = client.search_recent_tweets(
#             query=query,
#             tweet_fields=["public_metrics"],
#             max_results=10  # minimum allowed
#         )

#         if not tweets.data:
#             return []

#         # Take only the first tweet
#         first_tweet = tweets.data[0]
#         return [{
#             "text": first_tweet.text,
#             "retweet_count": first_tweet.public_metrics.get("retweet_count", 0),
#             "like_count": first_tweet.public_metrics.get("like_count", 0)
#         }]

#     except Exception as e:
#         print("⚠️ Error fetching tweets:", e)
#         return []

def fetch_crypto_tweets(crypto_name):
    """Fetch recent tweets using Tweepy v2 Client."""
    # --- check cache first ---
    now = time.time()
    if crypto_name in tweet_cache and now - tweet_cache[crypto_name]['time'] < CACHE_DURATION:
        return tweet_cache[crypto_name]['tweets']

    try:
        client = tweepy.Client(bearer_token=BEARER_TOKEN)
        query = f"{crypto_name} lang:en -is:retweet"
        
        tweets = client.search_recent_tweets(
            query=query,
            tweet_fields=["public_metrics"],
            max_results=10
        )

        if not tweets.data:
            return []

        # Build a list of tweet dictionaries
        tweet_list = [{
            "text": t.text,
            "retweet_count": t.public_metrics.get("retweet_count", 0),
            "like_count": t.public_metrics.get("like_count", 0)
        } for t in tweets.data]

        # store in cache
        tweet_cache[crypto_name] = {'time': now, 'tweets': tweet_list}

        return tweet_list

    except Exception as e:
        print("⚠️ Error fetching tweets:", e)
        return []


# ---------------------------
# Fetch Reddit Data
# ---------------------------
def fetch_crypto_posts(coin_id, limit=50):
    """Fetch Reddit posts related to the crypto."""
    try:
        url = f"https://www.reddit.com/r/{coin_id}/hot.json?limit={limit}"
        headers = {"User-Agent": "CryptoSentimentApp/1.0"}
        res = requests.get(url, headers=headers, timeout=10)
        data = res.json()
        posts = [
            {
                "title": p["data"]["title"],
                "selftext": p["data"].get("selftext", ""),
                "score": p["data"].get("score", 0),
                "url": f"https://reddit.com{p['data'].get('permalink', '')}"
            }
            for p in data.get("data", {}).get("children", [])
        ]
        return posts
    except Exception as e:
        print("⚠️ Error fetching Reddit posts:", e)
        return []


# ---------------------------
# Fetch Price from CoinGecko
# ---------------------------
def get_crypto_price(coin_id):
    try:
        res = requests.get(f"{COINGECKO_URL}?ids={coin_id}&vs_currencies=usd", timeout=10)
        return res.json().get(coin_id, {})
    except Exception as e:
        print("⚠️ Price fetch failed:", e)
        return {}


# ---------------------------
# Routes
# ---------------------------
@app.route("/")
def home():
    return jsonify({"message": "🚀 Welcome to the Crypto Sentiment Analyzer API!"})


@app.route("/api/crypto/<coin_id>", methods=["GET"])
def crypto_info(coin_id):
    coin_id = coin_id.lower().strip()

    # --- Fetch Data ---
    print(f"Fetching data for {coin_id}...")
    price_data = get_crypto_price(coin_id)
    reddit_posts = fetch_crypto_posts(coin_id, limit=30)
    tweets = fetch_crypto_tweets(coin_id)

    # --- Analyze Sentiment ---
    reddit_sentiments = [analyze_sentiment(post["title"] + " " + post.get("selftext", "")) for post in reddit_posts]
    avg_reddit_score = sum(s["combined_score"] for s in reddit_sentiments) / len(reddit_sentiments) if reddit_sentiments else 0

    tweet_sentiments = [analyze_sentiment(tweet["text"]) for tweet in tweets]
    avg_tweet_score = sum(s["combined_score"] for s in tweet_sentiments) / len(tweet_sentiments) if tweet_sentiments else 0

    combined_avg_sentiment = (avg_reddit_score + avg_tweet_score) / 2 if (avg_reddit_score or avg_tweet_score) else 0
    res = requests.get(f"{COINGECKO_URL}?ids={coin_id}&vs_currencies=usd&include_24hr_change=true")
    price_data = res.json().get(coin_id, {})
    current_price = price_data.get("usd", 0)
    pct_change = price_data.get("usd_24h_change", 0)
    # --- ML Model Prediction ---
    prediction = None
    confidence = None
    if crypto_model:
        try:
            features = [[current_price, combined_avg_sentiment, pct_change]]
            prediction = crypto_model.predict(features)[0]
            if hasattr(crypto_model, "predict_proba"):
                confidence = float(crypto_model.predict_proba(features)[0].max())
        except Exception as e:
            print(f"⚠️ ML prediction error: {e}")
            prediction = None
            confidence = None
       
    # --- Identify Most Popular Posts ---
    popular_reddit_post = max(reddit_posts, key=lambda x: x["score"], default=None)
    popular_tweet = max(tweets, key=lambda x: x.get("retweet_count", 0), default=None)
    #popular_tweet = {"text": "", "retweet_count": 0, "like_count": 0} if not tweets else max(tweets, key=lambda x: x.get("retweet_count", 0))


    # --- Summary Message ---
    summary = (
        "📈 Mostly positive sentiment — potential upward trend."
        if combined_avg_sentiment > 0.05 else
        "📉 Mostly negative sentiment — possible dip ahead."
        if combined_avg_sentiment < -0.05 else
        "⚖️ Neutral sentiment — market uncertain."
    )

    # --- Final Response ---
    return jsonify({
    "crypto": coin_id,
    "price_usd": float(price_data.get("usd", 0)) if price_data.get("usd") is not None else "N/A",
    "average_sentiment": round(combined_avg_sentiment, 3),
    "prediction": int(prediction) if prediction is not None else None,
    "confidence": float(confidence) if confidence is not None else None,
    "summary": summary,
    "reddit": {
        "average_sentiment": round(avg_reddit_score, 3),
        "most_popular_post": popular_reddit_post
    },
    "twitter": {
        "average_sentiment": round(avg_tweet_score, 3),
        "most_popular_tweet": popular_tweet
    },
    "counts": {
        "reddit_posts": len(reddit_posts),
        "tweets": len(tweets)
    }
})



# ---------------------------
# Run App
# ---------------------------
if __name__ == "__main__":
    app.run(debug=True)
