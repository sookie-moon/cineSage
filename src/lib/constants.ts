export const POINTS_PER_CORRECT_ANSWER = 100;

export const HINT_PENALTIES = {
  CAST: 20,
  YEAR: 30,
  DIRECTOR: 40,
};

export const MAX_HINTS = 3;

export const HINT_TYPES = {
  CAST: { label: "Cast", points: HINT_PENALTIES.CAST },
  YEAR: { label: "Year", points: HINT_PENALTIES.YEAR },
  DIRECTOR: { label: "Director", points: HINT_PENALTIES.DIRECTOR },
} as const;

export type HintCategory = keyof typeof HINT_TYPES;
