
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Check for API key during initialization (primarily for server-side Next.js context)
// This log will appear in your Vercel function logs if the key is missing.
if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_API_KEY) {
  console.warn(
    'WARNING: GEMINI_API_KEY or GOOGLE_API_KEY is not set in the environment. ' +
    'AI features (like riddle generation) will likely fail. ' +
    'Please ensure this is configured in your Vercel project settings.'
  );
}

export const ai = genkit({
  plugins: [googleAI()], // googleAI() will also throw an error if the key is missing when it tries to make an API call
  model: 'googleai/gemini-2.0-flash',
});
