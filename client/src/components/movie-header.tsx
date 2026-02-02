import { MovieResult } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Film, Tv, Clock, Calendar, Clapperboard } from "lucide-react";

interface MovieHeaderProps {
  movie: MovieResult;
}

export function MovieHeader({ movie }: MovieHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex-shrink-0 mx-auto md:mx-0">
        <div className="relative w-48 md:w-56 aspect-[2/3] rounded-xl overflow-hidden shadow-lg border-4 border-background">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
            data-testid="img-poster"
          />
        </div>
      </div>
      
      <div className="flex-1 flex flex-col justify-center text-center md:text-left">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-3">
          <Badge variant="secondary" className="gap-1.5">
            {movie.type === "movie" ? (
              <>
                <Film className="h-3.5 w-3.5" />
                Movie
              </>
            ) : (
              <>
                <Tv className="h-3.5 w-3.5" />
                TV Series
              </>
            )}
          </Badge>
          {movie.year && (
            <Badge variant="outline" className="gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {movie.year}
            </Badge>
          )}
          {movie.runtime && (
            <Badge variant="outline" className="gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {movie.runtime}
            </Badge>
          )}
        </div>
        
        <h1 
          className="text-3xl md:text-4xl font-bold tracking-tight mb-2"
          data-testid="text-title"
        >
          {movie.title}
        </h1>
        
        {movie.director && (
          <p className="text-muted-foreground mb-4 flex items-center justify-center md:justify-start gap-2">
            <Clapperboard className="h-4 w-4" />
            Directed by <span className="font-medium text-foreground">{movie.director}</span>
          </p>
        )}
        
        {movie.genres.length > 0 && (
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            {movie.genres.map((genre, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="bg-primary/5 border-primary/20 text-sm"
              >
                {genre}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
