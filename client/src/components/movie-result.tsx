import { MovieResult } from "@shared/schema";
import { MovieHeader } from "./movie-header";
import { RatingsTable } from "./ratings-table";
import { PlotSummary } from "./plot-summary";
import { CastList } from "./cast-list";
import { StreamingInfoCard } from "./streaming-info";
import { Card, CardContent } from "@/components/ui/card";

interface MovieResultViewProps {
  movie: MovieResult;
}

export function MovieResultView({ movie }: MovieResultViewProps) {
  return (
    <div className="w-full max-w-4xl mx-auto" data-testid="movie-result">
      <Card>
        <CardContent className="p-6 space-y-8">
          <MovieHeader movie={movie} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RatingsTable ratings={movie.ratings} />
            <StreamingInfoCard streaming={movie.streaming} />
          </div>
          
          <PlotSummary summary={movie.plotSummary} />
          
          <CastList cast={movie.cast} />
        </CardContent>
      </Card>
    </div>
  );
}
