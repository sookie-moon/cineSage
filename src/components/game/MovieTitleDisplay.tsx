
"use client";

import type React from 'react';

interface MovieTitleDisplayProps {
  title: string | undefined;
  revealedLetters: Set<string>;
}

export default function MovieTitleDisplay({ title, revealedLetters }: MovieTitleDisplayProps) {
  if (!title) {
    return (
      <div className="my-6 p-4 border border-dashed border-muted-foreground rounded-lg text-center bg-secondary/30 min-h-[60px] flex items-center justify-center">
        <p className="text-xl md:text-2xl font-mono tracking-widest text-muted-foreground">Loading title...</p>
      </div>
    );
  }

  const displayString = title
    .split('')
    .map((char) => {
      if (char === ' ') {
        return ' '; 
      }
      if (char.match(/[a-zA-Z0-9]/)) { 
        return revealedLetters.has(char.toUpperCase()) ? char : '_';
      }
      return char; 
    })
    .join('');

  return (
    <div className="my-6 p-4 border border-dashed border-muted-foreground rounded-lg text-center bg-secondary/30">
      <p className="text-2xl md:text-3xl font-mono tracking-widest text-foreground break-all">
        {displayString.split('').map((char, index) => (
          <span key={index} className="inline-block min-w-[1em] mx-px sm:min-w-[1.5ch] sm:mx-0.5 py-1">
            {char === ' ' ? <>&nbsp;&nbsp;</> : char}
          </span>
        ))}
      </p>
    </div>
  );
}
