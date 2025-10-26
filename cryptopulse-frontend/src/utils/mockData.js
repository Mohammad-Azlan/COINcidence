export const mockCryptoData = {
  bitcoin: {
    name: "Bitcoin",
    symbol: "BTC",
    price: 67845.23,
    change24h: 2.45,
    marketCap: "1.33T",
    sentiment: {
      overall: "Positive",
      confidence: 78,
      distribution: {
        positive: 65,
        negative: 20,
        neutral: 15
      }
    },
    socialMentions: [
      {
        platform: "Twitter",
        text: "Bitcoin showing strong bullish momentum! 🚀",
        sentiment: "Positive",
        time: "2 hours ago"
      },
      {
        platform: "Reddit",
        text: "BTC breaking resistance levels, this is huge!",
        sentiment: "Positive", 
        time: "4 hours ago"
      },
      {
        platform: "Instagram",
        text: "Not sure about Bitcoin's current trend...",
        sentiment: "Neutral",
        time: "6 hours ago"
      }
    ],
    prediction: {
      text: "High chance of short-term price increase",
      confidence: 82,
      type: "bullish"
    }
  },
  ethereum: {
    name: "Ethereum",
    symbol: "ETH", 
    price: 3421.67,
    change24h: -1.23,
    marketCap: "411.2B",
    sentiment: {
      overall: "Neutral",
      confidence: 72,
      distribution: {
        positive: 45,
        negative: 35,
        neutral: 20
      }
    },
    socialMentions: [
      {
        platform: "Twitter",
        text: "Ethereum gas fees are still too high IMO",
        sentiment: "Negative",
        time: "1 hour ago"
      },
      {
        platform: "Reddit",
        text: "ETH 2.0 updates looking promising for long term",
        sentiment: "Positive",
        time: "3 hours ago"
      },
      {
        platform: "Instagram", 
        text: "Holding my ETH position, waiting to see what happens",
        sentiment: "Neutral",
        time: "5 hours ago"
      }
    ],
    prediction: {
      text: "Likely to remain stable with slight volatility",
      confidence: 68,
      type: "neutral"
    }
  },
  solana: {
    name: "Solana",
    symbol: "SOL",
    price: 198.45,
    change24h: 5.67,
    marketCap: "92.8B",
    sentiment: {
      overall: "Positive",
      confidence: 85,
      distribution: {
        positive: 70,
        negative: 15,
        neutral: 15
      }
    },
    socialMentions: [
      {
        platform: "Twitter",
        text: "Solana ecosystem is absolutely crushing it right now!",
        sentiment: "Positive",
        time: "30 minutes ago"
      },
      {
        platform: "Reddit",
        text: "SOL has been my best performer this month",
        sentiment: "Positive",
        time: "2 hours ago"
      },
      {
        platform: "Instagram",
        text: "Solana network improvements are impressive",
        sentiment: "Positive", 
        time: "4 hours ago"
      }
    ],
    prediction: {
      text: "Strong bullish momentum, expect continued growth",
      confidence: 88,
      type: "bullish"
    }
  }
};
