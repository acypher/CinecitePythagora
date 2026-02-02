import { CastMember } from "@shared/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users } from "lucide-react";

interface CastListProps {
  cast: CastMember[];
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function CastList({ cast }: CastListProps) {
  if (!cast || cast.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
        <Users className="h-5 w-5 text-primary" />
        Top Cast
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cast.map((member, index) => (
          <div 
            key={index} 
            className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
            data-testid={`cast-member-${index}`}
          >
            <Avatar className="h-12 w-12 border-2 border-background">
              <AvatarImage src={member.imageUrl} alt={member.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {getInitials(member.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{member.name}</p>
              {member.character && (
                <p className="text-sm text-muted-foreground truncate">
                  as {member.character}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
