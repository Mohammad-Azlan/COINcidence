import { useState } from 'react';
import SearchBar from './components/SearchBar';
import CryptoInfo from './components/CryptoInfo';
import SentimentChart from './components/SentimentChart';
import SocialMentions from './components/SocialMentions';
import PredictionCard from './components/PredictionCard';
import LoadingSpinner from './components/LoadingSpinner';
import './App.css';

function App() {
  const [cryptoData, setCryptoData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (cryptoName) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:5000/api/crypto/${cryptoName.toLowerCase()}`);


      if (!response.ok) throw new Error('Failed to fetch data');

      const data = await response.json();

      // --- Format social mentions properly ---
      const socialMentions = [];

      if (data.reddit?.most_popular_post) {
        socialMentions.push({
          platform: 'Reddit',
          text: data.reddit.most_popular_post.title,
          // Use platform-specific average for post sentiment label
          sentiment: data.reddit.average_sentiment > 0.05 ? 'Positive'
                   : data.reddit.average_sentiment < -0.05 ? 'Negative'
                   : 'Neutral',
          time: 'recent'
        });
      }

      if (data.twitter?.most_popular_tweet) {
        socialMentions.push({
          platform: 'Twitter',
          text: data.twitter.most_popular_tweet.text,
          // Use platform-specific average for post sentiment label
          sentiment: data.twitter.average_sentiment > 0.05 ? 'Positive'
                   : data.twitter.average_sentiment < -0.05 ? 'Negative'
                   : 'Neutral',
          time: 'recent'
        });
      }

      const formattedData = {
        name: data.crypto.charAt(0).toUpperCase() + data.crypto.slice(1),
        symbol: data.crypto.slice(0, 3).toUpperCase(),
        price: data.price_usd,
        change24h: data.pct_change || 0,
        marketCap: 'N/A',
        sentiment: {
          overall: data.average_sentiment > 0.05 ? 'Positive'
                   : data.average_sentiment < -0.05 ? 'Negative'
                   : 'Neutral',
          confidence: data.confidence ? Math.round(data.confidence * 100) : 0,
          average_sentiment: data.average_sentiment // Pass the raw score for the chart
        },
        // *** REMOVED: The redundant and flawed 'distribution' object ***
        prediction: {
          type: data.prediction === 1 ? 'bullish'
                : data.prediction === -1 ? 'bearish'
                : 'neutral',
          text: data.summary,
          confidence: data.confidence ? Math.round(data.confidence * 100) : 0
        },
        socialMentions
      };

      setCryptoData(formattedData);
    } catch (err) {
      console.error('Error:', err);
      // Ensure the error response from Flask is handled for 404
      const errorMessage = (err.message === 'Failed to fetch data') 
                         ? `Could not find data for that crypto. Try 'bitcoin' or 'ethereum'.`
                         : `Failed to analyze ${cryptoName}. Please try again.`;
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 shadow-lg">
        <div className="container mx-auto px-6 py-6">
          <h1 className="text-4xl font-bold text-center">
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              CryptoPulse
            </span>
          </h1>
          <p className="text-gray-400 text-center mt-2 text-lg">
            AI-Powered Crypto Sentiment Analysis
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        
        {isLoading && <LoadingSpinner />}
        
        {error && (
          <div className="max-w-2xl mx-auto bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-center">
            <p className="text-red-400 text-lg">{error}</p>
          </div>
        )}
        
        {cryptoData && !isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-8">
              <CryptoInfo data={cryptoData} />
              <SentimentChart data={cryptoData.sentiment} />
            </div>
            
            {/* Right Column */}
            <div className="space-y-8">
              <PredictionCard prediction={cryptoData.prediction} />
              <SocialMentions mentions={cryptoData.socialMentions} />
            </div>
          </div>
        )}
        
        {!cryptoData && !isLoading && !error && (
          <div className="text-center text-gray-400 py-16">
            <div className="text-6xl mb-6">🔍</div>
            <h2 className="text-2xl font-semibold mb-4">Welcome to CryptoPulse</h2>
            <p className="text-lg">
              Enter a cryptocurrency name above to analyze real-time social sentiment
            </p>
            <p className="text-sm mt-2 text-gray-500">
              Try: Bitcoin, Ethereum, or Solana
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-16">
        <div className="container mx-auto px-6 py-6 text-center text-gray-400">
          <p>&copy; 2025 CryptoPulse. Built with React & Tailwind CSS for Hackathon.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;