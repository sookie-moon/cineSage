
// Use server directive.
'use server';

/**
 * @fileOverview Generates challenging movie riddles using GenAI, including hint data.
 *
 * - generateMovieRiddle - A function that generates a movie riddle with hints.
 * - GenerateMovieRiddleInput - The input type for the generateMovieRiddle function.
 * - GenerateMovieRiddleOutput - The return type for the generateMovieRiddle function, including hint details.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMovieRiddleInputSchema = z.object({
  difficulty: z
    .enum(['easy', 'medium', 'hard', 'expert']) // Added expert for more difficulty
    .describe('The difficulty level of the movie riddle.'),
});

export type GenerateMovieRiddleInput = z.infer<typeof GenerateMovieRiddleInputSchema>;

const GenerateMovieRiddleOutputSchema = z.object({
  riddle: z.string().describe('The generated movie riddle.'),
  movieTitle: z.string().describe('The title of the movie.'),
  cast: z.array(z.string()).describe('A list of 2-3 main actors in the movie. e.g., ["Actor One", "Actor Two"]'),
  year: z.string().describe('The release year of the movie as a string. e.g., "1999"'),
  director: z.string().describe('The director of the movie. e.g., "Director Name"'),
});

export type GenerateMovieRiddleOutput = z.infer<typeof GenerateMovieRiddleOutputSchema>;

export async function generateMovieRiddle(input: GenerateMovieRiddleInput): Promise<GenerateMovieRiddleOutput> {
  return generateMovieRiddleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMovieRiddlePrompt',
  input: {schema: GenerateMovieRiddleInputSchema},
  output: {schema: GenerateMovieRiddleOutputSchema},
  prompt: `You are an expert movie riddle creator. Your task is to generate a challenging movie riddle based on the specified difficulty level.
The riddle should be creative, engaging, and require a deep understanding of movie plots, characters, and trivia.
For 'hard' or 'expert' difficulty, make the riddle significantly more obscure, indirect, or based on subtle details of the movie.

Also provide the following information for the movie, ensuring it matches the schema requirements:
- The movie title.
- A list of 2-3 main actors (cast).
- The release year (as a string, e.g., "2001").
- The director's name.

Difficulty Level: {{{difficulty}}}

Riddle:`,
});

const generateMovieRiddleFlow = ai.defineFlow(
  {
    name: 'generateMovieRiddleFlow',
    inputSchema: GenerateMovieRiddleInputSchema,
    outputSchema: GenerateMovieRiddleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate riddle details from AI model.');
    }
    return output;
  }
);
