from textblob import TextBlob
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import re

# Initialize VADER
analyzer = SentimentIntensityAnalyzer()

# Add crypto-specific slang with custom scores
crypto_lexicon = {
    "moon": 3.0,
    "hodl": 2.5,
    "pump": 2.0,
    "dump": -2.0,
    "rekt": -3.0,
    "fomo": 1.5,
    "fud": -1.5,
    "diamond hands": 2.0,
    "paper hands": -2.0,
    "to the moon": 3.0,
    "moonshot": 3.0
}

analyzer.lexicon.update(crypto_lexicon)

# Emoji mapping (simple)
emoji_map = {
    "🚀": 2.5,
    "🔥": 2.0,
    "💎": 2.0,
    "📉": -2.0,
    "📈": 2.0,
    "💀": -2.5,
    "😭": -2.0,
    "😂": 1.5
}

def preprocess_emojis(text):
    for emoji, score in emoji_map.items():
        if emoji in text:
            text = text.replace(emoji, f" {emoji} ")
    return text

def analyze_sentiment(text):
    text = preprocess_emojis(text.lower())

    # TextBlob sentiment
    blob = TextBlob(text)
    tb_polarity = blob.sentiment.polarity
    tb_subjectivity = blob.sentiment.subjectivity

    # VADER sentiment
    vader_scores = analyzer.polarity_scores(text)

    # Combine results (simple average of compound + TextBlob polarity)
    combined_score = (tb_polarity + vader_scores["compound"]) / 2

    # Determine final label
    if combined_score >= 0.1:
        label = "Positive"
    elif combined_score <= -0.1:
        label = "Negative"
    else:
        label = "Neutral"

    return {
        "text": text,
        "label": label,
        "combined_score": combined_score,
        "textblob": {"polarity": tb_polarity, "subjectivity": tb_subjectivity},
        "vader": vader_scores
    }

