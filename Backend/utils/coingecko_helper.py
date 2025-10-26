# In your analyze() function, replace the price fetch with:
try:
    # Map common crypto names to CoinGecko IDs
    crypto_map = {
        "bitcoin": "bitcoin",
        "ethereum": "ethereum",
        "solana": "solana",
        "btc": "bitcoin",
        "eth": "ethereum",
        "sol": "solana"
    }
    
    coin_id = crypto_map.get(crypto_name, crypto_name)
    
    res = requests.get(
        f"{COINGECKO_URL}",
        params={
            "ids": coin_id,
            "vs_currencies": "usd",
            "include_24hr_change": "true",
            "include_market_cap": "true"
        }
    )
    price_data = res.json().get(coin_id, {})
    current_price = price_data.get("usd", 0)
    change_24h = price_data.get("usd_24h_change", 0)
    market_cap = price_data.get("usd_market_cap", 0)
except Exception as e:
    print("⚠️ Price fetch failed:", e)
    current_price = 0
    change_24h = 0
    market_cap = 0
