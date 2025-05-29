
"use client";

import type { GenerateMovieRiddleOutput } from "@/ai/flows/generate-movie-riddle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HINT_TYPES, type HintCategory, MAX_HINTS } from "@/lib/constants";
import { Lightbulb, Users, CalendarDays, Video } from "lucide-react";
import type React from "react";

interface HintsSectionProps {
  hintsUsedCount: number;
  revealedHints: Record<HintCategory, boolean>;
  onRequestHint: (category: HintCategory) => void;
  disabled: boolean;
  riddleData: GenerateMovieRiddleOutput | null;
}

const hintIcons: Record<HintCategory, React.ElementType> = {
  CAST: Users,
  YEAR: CalendarDays,
  DIRECTOR: Video,
};

export default function HintsSection({
  hintsUsedCount,
  revealedHints,
  onRequestHint,
  disabled,
  riddleData,
}: HintsSectionProps) {
  const canRequestMoreHints = hintsUsedCount < MAX_HINTS;

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-accent" />
          Hints
        </CardTitle>
        <CardDescription>
          Each hint will cost points. Up to {MAX_HINTS} hints available. Reveal in order: Cast, Year, Director.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {(Object.keys(HINT_TYPES) as HintCategory[]).map((category, index) => {
          const Icon = hintIcons[category];
          const hintDetails = HINT_TYPES[category];
          const isHintRevealed = revealedHints[category];
          const canRevealThisHint = index === hintsUsedCount;
          const hintText = hintDetails.getHintText ? hintDetails.getHintText(riddleData) : null;

          return (
            <div key={category} className="flex flex-col gap-2 p-3 border rounded-md bg-secondary/30">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Icon className={`h-5 w-5 ${isHintRevealed ? 'text-accent' : 'text-muted-foreground'}`} />
                  <span className={`font-medium ${isHintRevealed ? 'text-foreground' : 'text-muted-foreground'}`}>
                    Hint {index + 1}: {hintDetails.label}
                  </span>
                  {isHintRevealed && (
                    <span className="text-sm text-accent">(-{hintDetails.points} pts)</span>
                  )}
                </div>
                {!isHintRevealed && canRevealThisHint && canRequestMoreHints && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRequestHint(category)}
                    disabled={disabled}
                    className="w-full sm:w-auto mt-2 sm:mt-0"
                  >
                    Reveal Hint (-{hintDetails.points} pts)
                  </Button>
                )}
              </div>
              {isHintRevealed && hintText && (
                 <p className="text-sm text-foreground italic pl-0 sm:pl-7 mt-1 sm:mt-0">{hintText}</p>
              )}
               {!isHintRevealed && !canRevealThisHint && index < MAX_HINTS && hintsUsedCount < index && (
                 <p className="text-sm text-muted-foreground italic pl-0 sm:pl-7 mt-1 sm:mt-0">Reveal previous hints first.</p>
              )}
            </div>
          );
        })}
         {!canRequestMoreHints && hintsUsedCount === MAX_HINTS && (
          <p className="text-sm text-center text-muted-foreground pt-2">No more hints available for this riddle.</p>
        )}
      </CardContent>
    </Card>
  );
}
