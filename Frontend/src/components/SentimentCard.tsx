import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface SentimentCardProps {
  sentiment: {
    overall: string;
    confidence: number;
    distribution: {
      positive: number;
      negative: number;
      neutral: number;
    };
  };
}

export const SentimentCard = ({ sentiment }: SentimentCardProps) => {
  const data = [
    { name: "Positive", value: sentiment.distribution.positive, color: "hsl(var(--success))" },
    { name: "Negative", value: sentiment.distribution.negative, color: "hsl(var(--destructive))" },
    { name: "Neutral", value: sentiment.distribution.neutral, color: "hsl(var(--muted-foreground))" },
  ];

  return (
    <Card className="glass-card p-6 hover:border-primary/50 transition-all duration-300">
      <h3 className="text-xl font-bold mb-4">Sentiment Analysis</h3>
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-muted-foreground">Overall Sentiment</span>
          <span className="text-sm font-semibold">{sentiment.confidence}% confidence</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-2xl font-bold ${
            sentiment.overall === "Positive" ? "text-success" :
            sentiment.overall === "Negative" ? "text-destructive" :
            "text-muted-foreground"
          }`}>
            {sentiment.overall}
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "hsl(var(--card))", 
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px"
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};
