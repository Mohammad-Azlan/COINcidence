from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import tweepy
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

# --- Flask setup ---
app = Flask(__name__)
CORS(app)   # Allow frontend (React) to call backend

# --- API keys ---
BEARER_TOKEN = "YOUR_TWITTER_BEARER_TOKEN"   # 🔑 Replace with your actual key       //CHANGE THISS LATERRRRRRR
COINGECKO_URL = "https://api.coingecko.com/api/v3/simple/price"

# --- Twitter setup ---
def get_tweets(crypto_name, limit=20):
    """
    Fetch recent tweets about the given crypto using Tweepy.
    """
    try:
        client = tweepy.Client(bearer_token=BEARER_TOKEN)
        query = f"{crypto_name} -is:retweet lang:en"
        tweets = client.search_recent_tweets(query=query, max_results=limit)
        if not tweets.data:
            return []
        return [t.text for t in tweets.data]
    except Exception as e:
        print("⚠️ Error fetching tweets:", e)
        return []

# --- Sentiment analysis ---
def analyze_sentiment(posts):
    """
    Analyze list of text posts and return average sentiment.
    """
    analyzer = SentimentIntensityAnalyzer()
    totals = {"pos": 0, "neg": 0, "neu": 0}
    if not posts:
        return {"pos": 0, "neg": 0, "neu": 0}

    for post in posts:
        score = analyzer.polarity_scores(post)
        totals["pos"] += score["pos"]
        totals["neg"] += score["neg"]
        totals["neu"] += score["neu"]

    n = len(posts)
    avg = {k: v / n for k, v in totals.items()}
    return avg

# --- Flask routes ---
@app.route('/')
def home():
    return jsonify({"message": "Welcome to the Crypto Sentiment Analyzer API!"})

@app.route('/analyze', methods=['POST'])
def analyze():
    """
    Main endpoint: receives crypto name, analyzes sentiment, returns JSON result.
    """
    data = request.get_json()
    crypto_name = data.get('crypto_name', '').lower().strip()

    if not crypto_name:
        return jsonify({"error": "Missing crypto name"}), 400

    # --- Step 1: Get tweets ---
    posts = get_tweets(crypto_name)
    if not posts:
        return jsonify({"error": f"No tweets found for {crypto_name}"}), 404

    # --- Step 2: Run sentiment analysis ---
    sentiment = analyze_sentiment(posts)

    # --- Step 3: Get current price ---
    price_data = {}
    try:
        res = requests.get(f"{COINGECKO_URL}?ids={crypto_name}&vs_currencies=usd")
        price_data = res.json().get(crypto_name, {})
    except Exception as e:
        print("⚠️ Price fetch failed:", e)

    # --- Step 4: Generate summary ---
    pos = sentiment["pos"]
    neg = sentiment["neg"]
    neu = sentiment["neu"]

    if pos > neg:
        summary = "Mostly positive sentiment — likely short-term price increase 📈"
    elif neg > pos:
        summary = "Mostly negative sentiment — possible price drop 📉"
    else:
        summary = "Neutral sentiment — market indecisive ⚖️"

    # --- Step 5: Return JSON response ---
    return jsonify({
        "crypto": crypto_name,
        "positive": round(pos, 2),
        "negative": round(neg, 2),
        "neutral": round(neu, 2),
        "price_usd": price_data.get("usd", "N/A"),
        "summary": summary
    })

# --- Run the app ---
if __name__ == "__main__":
    app.run(debug = True)




# add tailwind CSS integration
# make sure all output statements are there, connect with frontend for pie charts
# put all APIs here
# predefined model
# add self made model or pathway to the pickle file of model in github repo