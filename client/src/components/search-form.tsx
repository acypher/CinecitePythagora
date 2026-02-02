import { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface SearchFormProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  initialQuery?: string;
}

export function SearchForm({ onSearch, isLoading, initialQuery = "" }: SearchFormProps) {
  const [query, setQuery] = useState(initialQuery);
  const [multiMode, setMultiMode] = useState(false);

  // Update query when initialQuery changes
  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      if (multiMode) {
        // Open in new tab and clear the input
        const searchUrl = `${window.location.origin}/?q=${encodeURIComponent(query.trim())}`;
        window.open(searchUrl, "_blank");
        setQuery("");
      } else {
        onSearch(query.trim());
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="grid grid-cols-[1fr_auto] gap-3 items-start">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Enter a movie or TV show name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-12 pr-4 h-14 text-lg rounded-xl border-2 focus-visible:ring-2 focus-visible:ring-primary/20"
            data-testid="input-search"
            disabled={isLoading}
          />
        </div>
        <div className="flex flex-col items-start gap-2">
          <Button 
            type="submit" 
            size="lg" 
            className="h-14 px-8 rounded-xl text-base font-semibold"
            disabled={isLoading || !query.trim()}
            data-testid="button-search"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Search"
            )}
          </Button>
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox 
              id="multi-mode" 
              checked={multiMode} 
              onCheckedChange={(checked) => setMultiMode(checked === true)}
              data-testid="checkbox-multi"
            />
            <span className="text-sm text-muted-foreground">Multi</span>
          </label>
        </div>
      </div>
    </form>
  );
}
