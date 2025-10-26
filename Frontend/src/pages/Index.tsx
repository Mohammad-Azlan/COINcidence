import { useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import { PriceCard } from "@/components/PriceCard";
import { SentimentCard } from "@/components/SentimentCard";
import { SocialMentions } from "@/components/SocialMentions";
import { PredictionCard } from "@/components/PredictionCard";
import { ChartCard } from "@/components/ChartCard";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface CryptoData {
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap: string;
  sentiment: {
    overall: string;
    confidence: number;
    distribution: {
      positive: number;
      negative: number;
      neutral: number;
    };
  };
  socialMentions: Array<{
    platform: string;
    text: string;
    sentiment: string;
    time: string;
  }>;
  prediction: {
    text: string;
    confidence: number;
    type: string;
  };
}

const Index = () => {
  const [cryptoData, setCryptoData] = useState<CryptoData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ crypto_name: query }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch crypto data");
      }

      const data = await response.json();
      setCryptoData(data);
      toast({
        title: "Analysis Complete",
        description: `Successfully analyzed ${data.name}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch crypto data. Make sure the backend is running on port 5000.",
        variant: "destructive",
      });
      console.error("Error fetching crypto data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <h1 className="text-5xl md:text-6xl font-bold gradient-text">
            CryptoPulse
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real-time cryptocurrency sentiment analysis powered by AI
          </p>
        </div>

        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
              <p className="text-muted-foreground">Analyzing sentiment data...</p>
            </div>
          </div>
        )}

        {/* Dashboard */}
        {!isLoading && cryptoData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-1 space-y-6">
              <PriceCard
                name={cryptoData.name}
                symbol={cryptoData.symbol}
                price={cryptoData.price}
                change24h={cryptoData.change24h}
                marketCap={cryptoData.marketCap}
              />
              <SentimentCard sentiment={cryptoData.sentiment} />
            </div>

            {/* Middle Column */}
            <div className="lg:col-span-1 space-y-6">
              <ChartCard currentPrice={cryptoData.price} />
              <PredictionCard prediction={cryptoData.prediction} />
            </div>

            {/* Right Column */}
            <div className="lg:col-span-1">
              <SocialMentions mentions={cryptoData.socialMentions} />
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !cryptoData && (
          <div className="text-center py-20 space-y-4">
            <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold">Start Your Analysis</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Search for any cryptocurrency to see real-time sentiment analysis, social mentions, and AI-powered predictions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
