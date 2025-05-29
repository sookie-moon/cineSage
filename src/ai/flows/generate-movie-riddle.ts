// Use server directive.
'use server';

/**
 * @fileOverview Generates challenging movie riddles using GenAI.
 *
 * - generateMovieRiddle - A function that generates a movie riddle.
 * - GenerateMovieRiddleInput - The input type for the generateMovieRiddle function.
 * - GenerateMovieRiddleOutput - The return type for the generateMovieRiddle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMovieRiddleInputSchema = z.object({
  difficulty: z
    .enum(['easy', 'medium', 'hard'])
    .describe('The difficulty level of the movie riddle.'),
});

export type GenerateMovieRiddleInput = z.infer<typeof GenerateMovieRiddleInputSchema>;

const GenerateMovieRiddleOutputSchema = z.object({
  riddle: z.string().describe('The generated movie riddle.'),
  movieTitle: z.string().describe('The title of the movie.'),
});

export type GenerateMovieRiddleOutput = z.infer<typeof GenerateMovieRiddleOutputSchema>;

export async function generateMovieRiddle(input: GenerateMovieRiddleInput): Promise<GenerateMovieRiddleOutput> {
  return generateMovieRiddleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMovieRiddlePrompt',
  input: {schema: GenerateMovieRiddleInputSchema},
  output: {schema: GenerateMovieRiddleOutputSchema},
  prompt: `You are an expert movie riddle creator. Your task is to generate a challenging movie riddle based on the specified difficulty level. The riddle should be creative, engaging, and require a deep understanding of movie plots, characters, and trivia. Also provide the movie title in a separate field.

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
    return output!;
  }
);
