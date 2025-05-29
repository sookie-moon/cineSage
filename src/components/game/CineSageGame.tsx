
"use client";

import { useState, useEffect, useCallback } from "react";
import { generateMovieRiddle, type GenerateMovieRiddleOutput } from "@/ai/flows/generate-movie-riddle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { HINT_TYPES, MAX_HINTS, POINTS_PER_CORRECT_ANSWER, type HintCategory } from "@/lib/constants";

import RiddleDisplay from "./RiddleDisplay";
import AnswerInput from "./AnswerInput";
import HintsSection from "./HintsSection";
import ScoreDisplay from "./ScoreDisplay";
import FeedbackMessage from "./FeedbackMessage";
import MovieTitleDisplay from "./MovieTitleDisplay";
import { Loader2, RotateCw } from "lucide-react";

type GameStatus = "loading" | "playing" | "answered" | "error";

const HIGH_SCORE_KEY = "cineSageHighScore";

const checkAllLettersRevealed = (title: string, revealed: Set<string>): boolean => {
  if (!title) return false;
  return title
    .toUpperCase()
    .split('')
    .every(char => !char.match(/[A-Z0-9]/) || revealed.has(char));
};


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
  
  const [revealedLetters, setRevealedLetters] = useState<Set<string>>(new Set());

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
    setRevealedLetters(new Set());
  };

  const fetchNewRiddle = useCallback(async () => {
    setGameStatus("loading");
    resetForNewRiddle();
    try {
      // Fetching a difficult riddle as requested
      const newRiddle = await generateMovieRiddle({ difficulty: "expert" }); 
      setRiddleData(newRiddle);
      const initialRevealed = new Set<string>();
      if (newRiddle && newRiddle.movieTitle) {
        newRiddle.movieTitle.toUpperCase().split('').forEach(char => {
          if (!char.match(/[A-Z0-9]/)) {
            initialRevealed.add(char);
          }
        });
      }
      setRevealedLetters(initialRevealed);
      setGameStatus("playing");
    } catch (error) {
      console.error("Failed to generate riddle:", error);
      toast({
        title: "Error",
        description: "Could not fetch a new riddle. Please try again.",
        variant: "destructive",
      });
      setGameStatus("error");
      setRiddleData(null);
    }
  }, [toast]);

  const handleGameWon = () => {
    if (!riddleData) return;
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
  };

  const handleRequestHint = (category: HintCategory) => {
    if (hintsUsedCount < MAX_HINTS && !revealedHints[category] && gameStatus === "playing") {
      const hintOrder: HintCategory[] = ['CAST', 'YEAR', 'DIRECTOR'];
      if (hintOrder[hintsUsedCount] !== category) {
        toast({ title: "Hint Order", description: "Please reveal hints in order (Cast, then Year, then Director).", variant: "default"});
        return;
      }

      setRevealedHints(prev => ({ ...prev, [category]: true }));
      setHintsUsedCount(prev => prev + 1);
      
      const penalty = HINT_TYPES[category].points;
      setCurrentHintPenalty(prev => prev + penalty);
      
      toast({
        title: `Hint Revealed: ${HINT_TYPES[category].label}`,
        description: `${HINT_TYPES[category].getHintText?.(riddleData) ?? ''} (-${penalty} points applied).`,
      });
    }
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!riddleData || gameStatus !== "playing" || !userAnswer.trim()) return;

    setGameStatus("loading"); 

    const guess = userAnswer.trim().toUpperCase();
    setUserAnswer(""); 

    if (guess.length === 1 && guess.match(/[A-Z0-9]/)) {
      const letter = guess;
      if (revealedLetters.has(letter)) {
        toast({ title: "Already Guessed", description: `You've already tried the letter '${letter}'.`, variant: "default" });
        setGameStatus("playing");
        return;
      }

      const newRevealedLetters = new Set(revealedLetters);
      newRevealedLetters.add(letter);
      setRevealedLetters(newRevealedLetters);

      if (riddleData.movieTitle.toUpperCase().includes(letter)) {
        toast({ title: "Good Guess!", description: `The letter '${letter}' is in the title.`, variant: "default" });
        if (checkAllLettersRevealed(riddleData.movieTitle, newRevealedLetters)) {
          handleGameWon();
        } else {
          setGameStatus("playing");
        }
      } else {
        toast({ title: "Incorrect Letter", description: `The letter '${letter}' is not in the title.`, variant: "destructive" });
        setGameStatus("playing");
      }
    } 
    else {
      if (guess === riddleData.movieTitle.toUpperCase()) {
        const allRevealed = new Set<string>();
        riddleData.movieTitle.toUpperCase().split('').forEach(char => allRevealed.add(char));
        setRevealedLetters(allRevealed);
        handleGameWon();
      } else {
        setFeedback({ type: "error", message: "That's not the full title. Try guessing letters or check your spelling!" });
        toast({ title: "Incorrect Title", description: "That's not the correct movie title.", variant: "destructive" });
        setGameStatus("playing");
      }
    }
  };

  const isLoadingInitial = gameStatus === "loading" && !riddleData?.riddle;
  const isSubmittingAnswer = gameStatus === "loading" && !!riddleData?.riddle;
  const isAnswered = gameStatus === "answered";

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
            <RiddleDisplay riddle={riddleData?.riddle ?? null} isLoading={isLoadingInitial} />
            
            {riddleData?.movieTitle && gameStatus !== "loading" && (
              <MovieTitleDisplay title={riddleData.movieTitle} revealedLetters={revealedLetters} />
            )}

            {feedback.message && (gameStatus === "answered" || feedback.type === "error" && gameStatus === "playing") && <FeedbackMessage type={feedback.type} message={feedback.message} />}


            {gameStatus === "playing" || isSubmittingAnswer ? (
              <>
                <AnswerInput
                  userAnswer={userAnswer}
                  setUserAnswer={setUserAnswer}
                  onSubmit={handleSubmitAnswer}
                  disabled={isAnswered || gameStatus !== "playing"}
                  isSubmitting={isSubmittingAnswer}
                />
                <HintsSection
                  hintsUsedCount={hintsUsedCount}
                  revealedHints={revealedHints}
                  onRequestHint={handleRequestHint}
                  disabled={isAnswered || gameStatus !== "playing"}
                  riddleData={riddleData}
                />
              </>
            ) : null}

            {isAnswered && (
              <Button onClick={fetchNewRiddle} className="w-full" variant="secondary">
                {isLoadingInitial ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RotateCw className="mr-2 h-4 w-4" />}
                {isLoadingInitial ? "Loading..." : "Next Riddle"}
              </Button>
            )}
            
            {isLoadingInitial && (
                <div className="flex justify-center items-center py-10">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
