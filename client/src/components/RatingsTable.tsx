import { Star, TrendingUp, Users } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import type { Rating } from '@/api/search';

interface RatingsTableProps {
  ratings: Rating[];
}

function getRatingColor(rating: string): string {
  const numericRating = parseFloat(rating);
  const percentage = rating.includes('%') ? numericRating : rating.includes('/100') ? numericRating : numericRating * 10;

  if (percentage >= 75) return 'text-green-600 dark:text-green-400';
  if (percentage >= 50) return 'text-yellow-600 dark:text-yellow-400';
  // Use black text for poor ratings with light red background for better readability
  return 'text-black dark:text-white';
}

function getRatingBadgeVariant(rating: string): 'default' | 'secondary' | 'destructive' {
  const numericRating = parseFloat(rating);
  const percentage = rating.includes('%') ? numericRating : rating.includes('/100') ? numericRating : numericRating * 10;

  if (percentage >= 75) return 'default';
  if (percentage >= 50) return 'secondary';
  return 'destructive';
}

function getRatingBadgeClass(rating: string): string {
  const numericRating = parseFloat(rating);
  const percentage = rating.includes('%') ? numericRating : rating.includes('/100') ? numericRating : numericRating * 10;

  // Override background color for poor ratings with very light red and black text
  if (percentage < 50) {
    return 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800';
  }
  return '';
}

export function RatingsTable({ ratings }: RatingsTableProps) {
  console.log('[RatingsTable] Rendering ratings:', ratings);

  return (
    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-2 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-b">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
          Ratings Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-900/50">
              <TableHead className="font-bold text-base">Source</TableHead>
              <TableHead className="font-bold text-base">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Critics Rating
                </div>
              </TableHead>
              <TableHead className="font-bold text-base">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Audience Rating
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ratings.map((rating, index) => (
              <TableRow 
                key={index}
                className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors"
              >
                <TableCell className="font-semibold text-base">{rating.source}</TableCell>
                <TableCell>
                  {rating.criticsRating ? (
                    <Badge
                      variant={getRatingBadgeVariant(rating.criticsRating)}
                      className={`text-base px-3 py-1 font-bold ${getRatingColor(rating.criticsRating)} ${getRatingBadgeClass(rating.criticsRating)}`}
                    >
                      {rating.criticsRating}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground italic">N/A</span>
                  )}
                </TableCell>
                <TableCell>
                  {rating.audienceRating ? (
                    <Badge
                      variant={getRatingBadgeVariant(rating.audienceRating)}
                      className={`text-base px-3 py-1 font-bold ${getRatingColor(rating.audienceRating)} ${getRatingBadgeClass(rating.audienceRating)}`}
                    >
                      {rating.audienceRating}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground italic">N/A</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}