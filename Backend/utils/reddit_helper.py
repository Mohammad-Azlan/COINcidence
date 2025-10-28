import praw

# Replace these with your credentials
reddit = praw.Reddit(
    client_id="YOUR_CLIENT_ID",
    client_secret="YOUR_CLIENT_SECRET",
    user_agent="YOUR_USER_AGENT"
)
def fetch_crypto_posts(coin_name, limit=10):
    """
    Fetch latest posts mentioning the coin from relevant subreddits
    """
    subreddits = ["cryptocurrency", "CryptoMoonShots", "CryptoCurrencyTrading"]
    posts = []

    for sub in subreddits:
        subreddit = reddit.subreddit(sub)
        for submission in subreddit.search(coin_name, limit=limit, sort="new"):
            posts.append({
                "title": submission.title,
                "score": submission.score,
                "url": submission.url,
                "created_utc": submission.created_utc
            })
    return posts
