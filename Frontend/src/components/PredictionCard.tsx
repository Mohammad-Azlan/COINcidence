import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, Sparkles } from "lucide-react";

interface PredictionCardProps {
  prediction: {
    text: string;
    confidence: number;
    type: string;
  };
}

export const PredictionCard = ({ prediction }: PredictionCardProps) => {
  const Icon = prediction.type === "bullish" ? TrendingUp :
               prediction.type === "bearish" ? TrendingDown : Minus;
  
  const colorClass = prediction.type === "bullish" ? "text-success bg-success/20" :
                     prediction.type === "bearish" ? "text-destructive bg-destructive/20" :
                     "text-muted-foreground bg-muted/20";

  return (
    <Card className="glass-card p-6 hover:border-primary/50 transition-all duration-300">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-primary" />
        <h3 className="text-xl font-bold">AI Prediction</h3>
      </div>

      <div className="space-y-4">
        <div className={`flex items-center gap-3 p-4 rounded-lg ${colorClass}`}>
          <Icon className="h-6 w-6" />
          <div className="flex-1">
            <p className="text-sm font-semibold capitalize">{prediction.type}</p>
            <p className="text-xs opacity-80">{prediction.confidence}% confidence</p>
          </div>
        </div>

        <div className="pt-4 border-t border-border/50">
          <p className="text-sm leading-relaxed text-foreground/80">
            {prediction.text}
          </p>
        </div>

        <div className="bg-secondary/30 p-3 rounded-lg">
          <p className="text-xs text-muted-foreground">
            ⚠️ This prediction is based on sentiment analysis and should not be considered financial advice.
          </p>
        </div>
      </div>
    </Card>
  );
};
