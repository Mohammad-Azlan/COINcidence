import { TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";

interface PriceCardProps {
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap: string;
}

export const PriceCard = ({ name, symbol, price, change24h, marketCap }: PriceCardProps) => {
  const isPositive = change24h >= 0;

  return (
    <Card className="glass-card p-6 hover:border-primary/50 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-2xl font-bold">{name}</h3>
          <p className="text-muted-foreground text-sm">{symbol}</p>
        </div>
        <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${
          isPositive ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'
        }`}>
          {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          <span className="text-sm font-semibold">{Math.abs(change24h).toFixed(2)}%</span>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Current Price</p>
          <p className="text-4xl font-bold gradient-text">${price.toLocaleString()}</p>
        </div>
        
        <div className="pt-4 border-t border-border/50">
          <p className="text-sm text-muted-foreground">Market Cap</p>
          <p className="text-xl font-semibold">${marketCap}</p>
        </div>
      </div>
    </Card>
  );
};
