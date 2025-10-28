# utils/twitter_helper.py
import tweepy
import time

# --- Configuration ---
BEARER_TOKEN = "YOUR_BEARER_TOKEN"

# --- In-Memory Cache ---
tweet_cache = {}
CACHE_DURATION = 900  # 15 minutes in seconds

def fetch_crypto_tweets(crypto_name, max_results=10, ignore_cache=False):
    """
    Fetch recent tweets about a crypto.
    Uses in-memory cache to avoid hitting Twitter rate limits.
    Crucially, it extends the cache duration if a rate limit is hit,
    preventing immediate retries.
    """
    now = time.time()
    crypto_name = crypto_name.lower().strip()

    # 1. Check Cache
    if not ignore_cache and crypto_name in tweet_cache:
        cached = tweet_cache[crypto_name]
        if now - cached['time'] < CACHE_DURATION:
            print(f"✅ Returning cached tweets for {crypto_name}")
            return cached['tweets']

    max_results = max(10, min(max_results, 100))
    # Initialize the client outside the cache check to ensure it's ready for an API call
    client = tweepy.Client(bearer_token=BEARER_TOKEN)
    query = f"#{crypto_name} OR {crypto_name} lang:en -is:retweet -is:reply" # Improved query

    try:
        # 2. Fetch Data from API
        tweets = client.search_recent_tweets(
            query=query,
            tweet_fields=["public_metrics"],
            max_results=max_results
        )

        # Handle case where API returns a successful response but no data
        if not tweets.data:
            print(f"⚠️ No new tweets returned by Twitter API for {crypto_name}. Returning old cache if available.")
            
            # Use the existing cache if available, and extend its life
            if crypto_name in tweet_cache:
                tweet_cache[crypto_name]['time'] = now
                return tweet_cache[crypto_name]['tweets']
            return []

        # 3. Process and Cache New Data
        tweet_list = [{
            "text": t.text,
            "retweet_count": t.public_metrics.get("retweet_count", 0),
            "like_count": t.public_metrics.get("like_count", 0)
        } for t in tweets.data]

        tweet_cache[crypto_name] = {'time': now, 'tweets': tweet_list}
        print(f"✅ Fetched {len(tweet_list)} tweets for {crypto_name}")
        return tweet_list

    except tweepy.TooManyRequests:
        # 4. Handle Rate Limit Error
        print(f"❌ Twitter API rate limit reached for {crypto_name}. Returning cached data and enforcing cooldown.")
        
        # --- ADD THIS TEMPORARY LINE ---
        cached_tweets = tweet_cache.get(crypto_name, {}).get('tweets', [])
        print(f"DEBUG: Returning {len(cached_tweets)} tweets from cache.")
        # -------------------------------
        
        # CRITICAL FIX: Update timestamp and return old cache
        if crypto_name in tweet_cache:
            # Extend the life of the old cache item to respect the rate limit cooldown
            tweet_cache[crypto_name]['time'] = now
            return tweet_cache[crypto_name]['tweets']
        return []