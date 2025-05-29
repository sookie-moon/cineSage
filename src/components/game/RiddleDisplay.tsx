import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Puzzle } from "lucide-react";

interface RiddleDisplayProps {
  riddle: string | null;
  isLoading: boolean;
}

export default function RiddleDisplay({ riddle, isLoading }: RiddleDisplayProps) {
  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
          <Puzzle className="h-6 w-6 text-primary" />
          <span>Solve the Riddle</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="min-h-[100px]">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : (
          <p className="text-lg leading-relaxed whitespace-pre-wrap">
            {riddle || "No riddle loaded yet. Click 'New Riddle' to start!"}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
