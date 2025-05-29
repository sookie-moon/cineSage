
"use client";

import { useState, useEffect, useCallback } from "react";
import { generateMovieRiddle, type GenerateMovieRiddleOutput } from "@/ai/flows/generate-movie-riddle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { HINT_PENALTIES, HINT_TYPES, MAX_HINTS, POINTS_PER_CORRECT_ANSWER, type HintCategory } from "@/lib/constants";

import RiddleDisplay from "./RiddleDisplay";
import AnswerInput from "./AnswerInput";
import HintsSection from "./HintsSection";
import ScoreDisplay from "./ScoreDisplay";
import FeedbackMessage from "./FeedbackMessage";
import { Loader2, RotateCw } from "lucide-react";

type GameStatus = "loading" | "playing" | "answered" | "error";

const HIGH_SCORE_KEY = "cineSageHighScore";

export default function CineSageGame() {
  const [riddleData, setRiddleData] = useState<GenerateMovieRiddleOutput | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [currentScore, setCurrentScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  const [hintsUsedCount, setHintsUsedCount] = useState(0);
  const [revealedHints, setRevealedHints] = useState<Record<HintCategory, boolean>>({
    CAST: false, YEAR: false, DIRECTOR: false
  });
  const [currentHintPenalty, setCurrentHintPenalty] = useState(0);

  const [gameStatus, setGameStatus] = useState<GameStatus>("loading");
  const [feedback, setFeedback] = useState<{type: "success" | "error" | "info" | null, message: string | null}>({ type: null, message: null });
  
  const { toast } = useToast();

  useEffect(() => {
    const storedHighScore = localStorage.getItem(HIGH_SCORE_KEY);
    if (storedHighScore) {
      setHighScore(parseInt(storedHighScore, 10));
    }
    fetchNewRiddle();
  }, []);

  const resetForNewRiddle = () => {
    setUserAnswer("");
    setHintsUsedCount(0);
    setRevealedHints({ CAST: false, YEAR: false, DIRECTOR: false });
    setCurrentHintPenalty(0);
    setFeedback({ type: null, message: null });
  };

  const fetchNewRiddle = useCallback(async () => {
    setGameStatus("loading");
    resetForNewRiddle();
    try {
      const newRiddle = await generateMovieRiddle({ difficulty: "hard" });
      setRiddleData(newRiddle);
      setGameStatus("playing");
    } catch (error) {
      console.error("Failed to generate riddle:", error);
      toast({
        title: "Error",
        description: "Could not fetch a new riddle. Please try again.",
        variant: "destructive",
      });
      setGameStatus("error");
      setRiddleData(null); // Clear riddle data on error
    }
  }, [toast]);

  const handleRequestHint = (category: HintCategory) => {
    if (hintsUsedCount < MAX_HINTS && !revealedHints[category] && gameStatus === "playing") {
      const hintOrder: HintCategory[] = ['CAST', 'YEAR', 'DIRECTOR'];
      if (hintOrder[hintsUsedCount] !== category) {
        toast({ title: "Hint Order", description: "Please reveal hints in order.", variant: "default"});
        return;
      }

      setRevealedHints(prev => ({ ...prev, [category]: true }));
      setHintsUsedCount(prev => prev + 1);
      
      const penalty = HINT_TYPES[category].points;
      setCurrentHintPenalty(prev => prev + penalty);
      
      toast({
        title: `Hint Revealed: ${HINT_TYPES[category].label}`,
        description: `-${penalty} points applied.`,
      });
    }
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!riddleData || gameStatus !== "playing" || !userAnswer.trim()) return;

    setGameStatus("loading"); 

    const isCorrect = userAnswer.trim().toLowerCase() === riddleData.movieTitle.toLowerCase();

    if (isCorrect) {
      const pointsEarned = POINTS_PER_CORRECT_ANSWER - currentHintPenalty;
      const newScore = currentScore + pointsEarned;
      setCurrentScore(newScore);
      
      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem(HIGH_SCORE_KEY, newScore.toString());
      }
      
      setFeedback({ type: "success", message: `You earned ${pointsEarned} points! The movie was "${riddleData.movieTitle}".` });
      toast({ title: "Correct!", description: `The movie was: ${riddleData.movieTitle}. You earned ${pointsEarned} points!`, variant: "default" });
      setGameStatus("answered");
    } else {
      setFeedback({ type: "error", message: "That's not it. Try again or use a hint!" });
      toast({ title: "Incorrect!", description: "Try again or use a hint.", variant: "destructive" });
      setGameStatus("playing"); 
    }
  };

  const isLoading = gameStatus === "loading" && !riddleData?.riddle;
  const isSubmitting = gameStatus === "loading" && !!riddleData?.riddle; 

  return (
    <div className="container mx-auto py-8 px-4 flex flex-col items-center">
      <div className="w-full max-w-2xl space-y-8">
        <ScoreDisplay currentScore={currentScore} highScore={highScore} />
        
        {gameStatus === "error" && (
           <Card className="w-full shadow-lg text-center bg-destructive/10 border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive-foreground text-xl">Oops! Something went wrong.</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="my-4 text-destructive-foreground/80">We couldn't load a riddle. Please try again.</p>
              <Button onClick={fetchNewRiddle} variant="destructive">
                <RotateCw className="mr-2 h-4 w-4" /> Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {gameStatus !== "error" && (
          <>
            <RiddleDisplay riddle={riddleData?.riddle ?? null} isLoading={isLoading} />
            
            {feedback.message && <FeedbackMessage type={feedback.type} message={feedback.message} />}

            {gameStatus === "playing" || (gameStatus === "loading" && !!riddleData?.riddle) ? (
              <>
                <AnswerInput
                  userAnswer={userAnswer}
                  setUserAnswer={setUserAnswer}
                  onSubmit={handleSubmitAnswer}
                  disabled={gameStatus !== "playing"}
                  isSubmitting={isSubmitting}
                />
                <HintsSection
                  hintsUsedCount={hintsUsedCount}
                  revealedHints={revealedHints}
                  onRequestHint={handleRequestHint}
                  disabled={gameStatus !== "playing"}
                  riddleData={riddleData}
                />
              </>
            ) : null}

            {gameStatus === "answered" && (
              <Button onClick={fetchNewRiddle} className="w-full" variant="secondary">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RotateCw className="mr-2 h-4 w-4" />}
                {isLoading ? "Loading..." : "Next Riddle"}
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
