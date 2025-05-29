import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Star } from "lucide-react";

interface ScoreDisplayProps {
  currentScore: number;
  highScore: number;
}

export default function ScoreDisplay({ currentScore, highScore }: ScoreDisplayProps) {
  return (
    <Card className="text-center shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-center gap-2 text-xl">
          <Award className="h-6 w-6 text-primary" />
          Scoreboard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <p className="text-lg font-semibold text-foreground">Current Score</p>
          <p className="text-3xl font-bold text-primary">{currentScore}</p>
        </div>
        <div className="border-t pt-2 mt-2">
          <p className="text-md font-semibold text-muted-foreground flex items-center justify-center gap-1">
            <Star className="h-4 w-4 text-accent" />
            Your High Score
          </p>
          <p className="text-2xl font-bold text-accent">{highScore}</p>
        </div>
      </CardContent>
    </Card>
  );
}
