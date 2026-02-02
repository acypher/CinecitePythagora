import { StreamingInfo } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Play, DollarSign, ShoppingCart, Sparkles } from "lucide-react";

interface StreamingInfoProps {
  streaming: StreamingInfo[];
}

function getTypeIcon(type: StreamingInfo["type"]) {
  switch (type) {
    case "subscription":
      return <Play className="h-4 w-4" />;
    case "free":
      return <Sparkles className="h-4 w-4" />;
    case "rent":
      return <DollarSign className="h-4 w-4" />;
    case "buy":
      return <ShoppingCart className="h-4 w-4" />;
  }
}

function getTypeBadgeVariant(type: StreamingInfo["type"]): "default" | "secondary" | "outline" {
  switch (type) {
    case "subscription":
    case "free":
      return "default";
    case "rent":
    case "buy":
      return "secondary";
  }
}

function getTypeLabel(type: StreamingInfo["type"]): string {
  switch (type) {
    case "subscription":
      return "Stream";
    case "free":
      return "Free";
    case "rent":
      return "Rent";
    case "buy":
      return "Buy";
  }
}

export function StreamingInfoCard({ streaming }: StreamingInfoProps) {
  if (!streaming || streaming.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
        <Play className="h-5 w-5 text-green-500" />
        Where to Watch
      </h3>
      <div className="flex flex-wrap gap-2">
        {streaming.map((service, index) => (
          <Badge 
            key={index}
            variant={getTypeBadgeVariant(service.type)}
            className="px-3 py-2 text-sm flex items-center gap-2"
            data-testid={`streaming-service-${index}`}
          >
            {getTypeIcon(service.type)}
            <span>{service.service}</span>
            <span className="text-xs opacity-70">({getTypeLabel(service.type)})</span>
          </Badge>
        ))}
      </div>
    </div>
  );
}
