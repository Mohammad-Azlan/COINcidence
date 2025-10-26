import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export const SearchBar = ({ onSearch, isLoading }: SearchBarProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("search") as string;
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-400 rounded-2xl opacity-20 group-hover:opacity-30 blur transition duration-300"></div>
        <div className="relative flex items-center gap-2 bg-card border border-border rounded-2xl p-2">
          <Search className="ml-3 h-5 w-5 text-muted-foreground" />
          <Input
            name="search"
            placeholder="Search crypto (e.g., Bitcoin, ETH, Solana)..."
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 rounded-xl"
            disabled={isLoading}
          >
            {isLoading ? "Analyzing..." : "Analyze"}
          </Button>
        </div>
      </div>
    </form>
  );
};
