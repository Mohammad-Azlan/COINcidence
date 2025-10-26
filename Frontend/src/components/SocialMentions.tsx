import { Card } from "@/components/ui/card";
import { MessageSquare, Clock } from "lucide-react";

interface SocialMention {
  platform: string;
  text: string;
  sentiment: string;
  time: string;
}

interface SocialMentionsProps {
  mentions: SocialMention[];
}

export const SocialMentions = ({ mentions }: SocialMentionsProps) => {
  return (
    <Card className="glass-card p-6 hover:border-primary/50 transition-all duration-300">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="h-5 w-5 text-primary" />
        <h3 className="text-xl font-bold">Social Mentions</h3>
      </div>

      <div className="space-y-4">
        {mentions.map((mention, idx) => (
          <div 
            key={idx} 
            className="p-4 rounded-lg bg-secondary/50 border border-border/50 hover:bg-secondary/70 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-xs font-semibold text-primary">{mention.platform}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                mention.sentiment === "Positive" ? "bg-success/20 text-success" :
                mention.sentiment === "Negative" ? "bg-destructive/20 text-destructive" :
                "bg-muted/20 text-muted-foreground"
              }`}>
                {mention.sentiment}
              </span>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed mb-2">{mention.text}</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{mention.time}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
