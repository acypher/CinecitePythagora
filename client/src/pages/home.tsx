import { useState, useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { Clapperboard } from "lucide-react";
import { SearchForm } from "@/components/search-form";
import { MovieResultView } from "@/components/movie-result";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { NoResults } from "@/components/no-results";
import { ThemeToggle } from "@/components/theme-toggle";
import { SearchResponse } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const STORAGE_KEY = "cinecite-last-query";

function looksLikeShowTitle(text: string): boolean {
  if (!text || text.length < 2 || text.length > 100) return false;
  
  // Reject if it looks like a URL, email, code, or file path
  if (text.includes("://") || text.includes("@") || text.includes("/") || text.includes("\\")) return false;
  if (text.includes("{") || text.includes("}") || text.includes("<") || text.includes(">")) return false;
  if (text.includes("=") || text.includes(";")) return false;
  
  // Reject if it has too many numbers (likely not a title)
  const numberRatio = (text.match(/\d/g) || []).length / text.length;
  if (numberRatio > 0.3) return false;
  
  // Reject if mostly special characters
  const letterRatio = (text.match(/[a-zA-Z]/g) || []).length / text.length;
  if (letterRatio < 0.5) return false;
  
  // Reject if it's multiple sentences or paragraphs
  if (text.split(/[.!?]/).length > 2) return false;
  if (text.includes("\n\n")) return false;
  
  return true;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [initialQuery, setInitialQuery] = useState("");
  const [result, setResult] = useState<SearchResponse | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [pendingAutoSearch, setPendingAutoSearch] = useState<string | null>(null);
  const { toast } = useToast();
  const resultsRef = useRef<HTMLDivElement>(null);

  const searchMutation = useMutation({
    mutationFn: async (query: string) => {
      const response = await apiRequest("POST", "/api/search", { query });
      return response.json() as Promise<SearchResponse>;
    },
    onSuccess: (data) => {
      setResult(data);
      setHasSearched(true);
      
      if (data.warnings && data.warnings.length > 0) {
        data.warnings.forEach((warning) => {
          toast({
            title: "Data Discrepancy",
            description: warning,
            variant: "destructive",
          });
        });
      }
      
      // Scroll to results after a short delay to ensure content is rendered
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    },
    onError: () => {
      setResult(null);
      setHasSearched(true);
    },
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, query);
    searchMutation.mutate(query);
  };

  const handleClear = () => {
    setSearchQuery("");
    setInitialQuery("");
    setResult(null);
    setHasSearched(false);
    searchMutation.reset();
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleRetry = () => {
    if (searchQuery) {
      searchMutation.mutate(searchQuery);
    }
  };

  // On mount, check URL param first, then clipboard, then localStorage
  useEffect(() => {
    async function initializeQuery() {
      let prefillQuery = "";
      let autoSearch = false;
      
      // Check URL query parameter first (for Multi mode)
      const urlParams = new URLSearchParams(window.location.search);
      const urlQuery = urlParams.get("q");
      if (urlQuery && urlQuery.trim()) {
        prefillQuery = urlQuery.trim();
        autoSearch = true;
        // Clean up the URL without reloading
        window.history.replaceState({}, "", window.location.pathname);
      }
      
      // If no URL param, try to read from clipboard (with timeout to prevent hanging)
      if (!prefillQuery) {
        try {
          if (navigator.clipboard && navigator.clipboard.readText) {
            const clipboardPromise = navigator.clipboard.readText();
            const timeoutPromise = new Promise<string>((_, reject) => 
              setTimeout(() => reject(new Error("timeout")), 1000)
            );
            const clipboardText = await Promise.race([clipboardPromise, timeoutPromise]);
            const trimmedClipboard = clipboardText?.trim();
            if (trimmedClipboard && looksLikeShowTitle(trimmedClipboard)) {
              prefillQuery = trimmedClipboard;
            }
          }
        } catch {
          // Clipboard access denied, unavailable, or timed out - that's fine
        }
      }
      
      // If no clipboard match, try localStorage
      if (!prefillQuery) {
        const storedQuery = localStorage.getItem(STORAGE_KEY);
        if (storedQuery) {
          prefillQuery = storedQuery;
        }
      }
      
      setInitialQuery(prefillQuery);
      setIsInitialized(true);
      
      // Set pending auto-search if we got a query from URL
      if (autoSearch && prefillQuery) {
        setPendingAutoSearch(prefillQuery);
      }
    }
    
    initializeQuery();
  }, []);

  // Execute pending auto-search after initialization
  useEffect(() => {
    if (pendingAutoSearch) {
      setSearchQuery(pendingAutoSearch);
      localStorage.setItem(STORAGE_KEY, pendingAutoSearch);
      searchMutation.mutate(pendingAutoSearch);
      setPendingAutoSearch(null);
    }
  }, [pendingAutoSearch]);

  // Don't render until initialized to prevent flash
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between gap-4 px-4 md:px-6">
          <a 
            href="/" 
            onClick={(e) => { e.preventDefault(); handleClear(); }}
            className="flex items-center gap-2 font-bold text-xl"
            data-testid="link-logo"
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-primary-foreground">
              <Clapperboard className="h-5 w-5" />
            </div>
            <span>Cinecite</span>
          </a>
          
          <ThemeToggle />
        </div>
      </header>

      <main className="container px-4 md:px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Check Ratings. Find Your Watch.
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Get ratings from Rotten Tomatoes, Metacritic, IMDb and more — all in one place.
          </p>
        </div>

        <div className="mb-12">
          <SearchForm 
            onSearch={handleSearch} 
            isLoading={searchMutation.isPending}
            initialQuery={initialQuery}
          />
        </div>

        <div ref={resultsRef}>
        {searchMutation.isPending && <LoadingSkeleton />}

        {searchMutation.isError && (
          <ErrorState 
            message="We couldn't complete your search. Please check your connection and try again." 
            onRetry={handleRetry}
          />
        )}

        {!searchMutation.isPending && !searchMutation.isError && (
          <>
            {!hasSearched && <EmptyState />}
            
            {hasSearched && result?.result && (
              <MovieResultView movie={result.result} />
            )}
            
            {hasSearched && !result?.result && (
              <NoResults query={searchQuery} onClear={handleClear} />
            )}
          </>
        )}
        </div>
      </main>
    </div>
  );
}
