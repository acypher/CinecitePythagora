import { Rating } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SiRottentomatoes, SiMetacritic } from "react-icons/si";
import { Star, Users, ThumbsUp } from "lucide-react";

interface RatingsTableProps {
  ratings: Rating[];
}

function getRatingColor(score: number | null, maxScore: number): string {
  if (score === null) return "bg-muted text-muted-foreground";
  const percentage = (score / maxScore) * 100;
  if (percentage >= 75) return "bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/30";
  if (percentage >= 60) return "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border-yellow-500/30";
  return "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30";
}

function getSourceIcon(source: string) {
  const sourceLower = source.toLowerCase();
  if (sourceLower.includes("rotten") || sourceLower.includes("tomatometer")) {
    return <SiRottentomatoes className="h-5 w-5 text-red-500" />;
  }
  if (sourceLower.includes("metacritic")) {
    return <SiMetacritic className="h-5 w-5 text-yellow-500" />;
  }
  if (sourceLower.includes("imdb")) {
    return <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />;
  }
  if (sourceLower.includes("audience")) {
    return <Users className="h-5 w-5 text-blue-500" />;
  }
  return <ThumbsUp className="h-5 w-5 text-muted-foreground" />;
}

export function RatingsTable({ ratings }: RatingsTableProps) {
  if (!ratings || ratings.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
        <Star className="h-5 w-5 text-accent fill-accent" />
        Ratings Overview
      </h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Source</TableHead>
            <TableHead className="text-right">Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ratings.map((rating, index) => (
            <TableRow key={index} data-testid={`row-rating-${index}`}>
              <TableCell>
                <div className="flex items-center gap-3">
                  {getSourceIcon(rating.source)}
                  <span className="font-medium">{rating.source}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Badge 
                  variant="outline" 
                  className={`font-bold text-sm px-3 py-1 ${getRatingColor(rating.score, rating.maxScore)}`}
                >
                  {rating.displayScore}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
