"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Send } from "lucide-react";
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
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="answer-input" className="text-md font-semibold mb-2 block">
          Your Guess:
        </Label>
        <Input
          id="answer-input"
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Enter movie title..."
          disabled={disabled || isSubmitting}
          className="text-base"
        />
      </div>
      <Button type="submit" disabled={disabled || isSubmitting || !userAnswer.trim()} className="w-full" variant="default">
        <Send className="mr-2 h-4 w-4" />
        {isSubmitting ? "Submitting..." : "Submit Answer"}
      </Button>
    </form>
  );
}
