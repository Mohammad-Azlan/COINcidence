import requests

BASE_URL = "https://api.coingecko.com/api/v3"

def get_crypto_price(coin_id):
    """
    Fetch current price and 24h change for a crypto coin
    coin_id example: 'bitcoin', 'ethereum', 'solana'
    """
    url = f"{BASE_URL}/simple/price"
    params = {
        "ids": coin_id.lower(),
        "vs_currencies": "usd",
        "include_24hr_change": "true"
    }
    try:
        response = requests.get(url, params=params)
        data = response.json()
        if coin_id.lower() in data:
            price = data[coin_id.lower()]["usd"]
            change_24h = data[coin_id.lower()]["usd_24h_change"]
            return {"price": price, "change_24h": change_24h}
        else:
            return {"error": "Coin not found"}
    except Exception as e:
        return {"error": str(e)}
