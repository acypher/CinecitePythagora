import { Sparkles } from "lucide-react";

export function EmptyState() {
  return (
    <div className="text-center py-16 px-4" data-testid="empty-state">
      <div className="relative inline-flex items-center justify-center mb-6">
        <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl" />
        <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20">
          <Sparkles className="h-10 w-10 text-primary" />
        </div>
      </div>
      
      <p className="text-muted-foreground max-w-sm mx-auto text-lg">
        Try searching for "Breaking Bad", "Oppenheimer", or "The Bear"
      </p>
    </div>
  );
}
