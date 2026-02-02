import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NoResultsProps {
  query: string;
  onClear: () => void;
}

export function NoResults({ query, onClear }: NoResultsProps) {
  return (
    <div className="text-center py-12 px-4" data-testid="no-results">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
        <SearchX className="h-10 w-10 text-muted-foreground" />
      </div>
      
      <h3 className="text-xl font-semibold mb-2">No results found</h3>
      <p className="text-muted-foreground max-w-sm mx-auto mb-6">
        We couldn't find any movies or TV shows matching "<span className="font-medium text-foreground">{query}</span>". 
        Try a different search term.
      </p>
      
      <Button onClick={onClear} variant="outline" data-testid="button-clear-search">
        Clear Search
      </Button>
    </div>
  );
}
