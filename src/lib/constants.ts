import type { GenerateMovieRiddleOutput } from "@/ai/flows/generate-movie-riddle";

export const POINTS_PER_CORRECT_ANSWER = 100;

export const HINT_PENALTIES = {
  CAST: 20,
  YEAR: 30,
  DIRECTOR: 40,
};

export const MAX_HINTS = 3; // Max hints per riddle

export const HINT_TYPES = {
  CAST: { 
    label: "Cast", 
    points: HINT_PENALTIES.CAST,
    getHintText: (data: GenerateMovieRiddleOutput | null) => data ? `Key cast members include: ${data.cast.join(', ')}.` : "Cast information unavailable."
  },
  YEAR: { 
    label: "Year", 
    points: HINT_PENALTIES.YEAR,
    getHintText: (data: GenerateMovieRiddleOutput | null) => data ? `Released in ${data.year}.` : "Release year unavailable."
  },
  DIRECTOR: { 
    label: "Director", 
    points: HINT_PENALTIES.DIRECTOR,
    getHintText: (data: GenerateMovieRiddleOutput | null) => data ? `Directed by ${data.director}.` : "Director information unavailable."
  },
} as const;

export type HintCategory = keyof typeof HINT_TYPES;
