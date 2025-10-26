# twitter.py
import tweepy

# -------------------------
# 1️⃣ Twitter API Credentials
# -------------------------
BEARER_TOKEN = "AAAAAAAAAAAAAAAAAAAAAOwe5AEAAAAAEqz3e1YdEhcUaZZqS1RJ8ELjSAA%3DuePghPPj3BkeHVMsyhkDxn2u1g5SFVm7DwPFwhfCSL7KxnOqJg"  # Replace with your actual token

# -------------------------
# 2️⃣ Tweepy Client Setup
# -------------------------
client = tweepy.Client(bearer_token=BEARER_TOKEN)

# -------------------------
# 3️⃣ Function to Fetch Tweets
# -------------------------
def fetch_recent_tweets(query, max_results=50):
    """
    Fetch recent tweets containing the query string.

    Args:
        query (str): The search query (e.g., "Bitcoin").
        max_results (int): Number of tweets to fetch (max 100 per request).

    Returns:
        List[str]: List of tweet texts.
    """
    try:
        response = client.search_recent_tweets(
            query=query,
            max_results=max_results,
            tweet_fields=["created_at", "author_id", "lang"]
        )

        tweets = response.data
        if not tweets:
            return []

        tweet_texts = [tweet.text for tweet in tweets]
        return tweet_texts

    except Exception as e:
        print(f"Error fetching tweets: {e}")
        return []

# -------------------------
# 4️⃣ Test Run
# -------------------------
if __name__ == "__main__":
    crypto_name = "Bitcoin"  # Example query
    tweets = fetch_recent_tweets(crypto_name, max_results=10)

    print(f"Fetched {len(tweets)} tweets about {crypto_name}:")
    for i, t in enumerate(tweets, 1):
        print(f"{i}. {t}\n")
