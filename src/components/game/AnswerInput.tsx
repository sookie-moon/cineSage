
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Send, Type } from "lucide-react"; // Added Type for letter guess indication
import type React from "react";

interface AnswerInputProps {
  userAnswer: string;
  setUserAnswer: (answer: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  disabled: boolean;
  isSubmitting: boolean;
}

export default function AnswerInput({
  userAnswer,
  setUserAnswer,
  onSubmit,
  disabled,
  isSubmitting,
}: AnswerInputProps) {
  const isLetterGuess = userAnswer.trim().length === 1 && userAnswer.match(/[a-zA-Z0-9]/);
  const buttonText = isSubmitting ? "Submitting..." : (isLetterGuess ? "Guess Letter" : "Submit Full Title");
  const ButtonIcon = isLetterGuess ? Type : Send;


  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="answer-input" className="text-md font-semibold mb-2 block">
          Your Guess (Letter or Full Title):
        </Label>
        <Input
          id="answer-input"
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Enter a letter or the full movie title..."
          disabled={disabled || isSubmitting}
          className="text-base"
          maxLength={50} // Reasonable max length for titles or single letters
        />
      </div>
      <Button 
        type="submit" 
        disabled={disabled || isSubmitting || !userAnswer.trim()} 
        className="w-full" 
        variant="default"
      >
        <ButtonIcon className="mr-2 h-4 w-4" />
        {buttonText}
      </Button>
    </form>
  );
}
