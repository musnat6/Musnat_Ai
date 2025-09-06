'use server';

/**
 * @fileOverview Generates a starting prompt for a personalized mentoring experience.
 *
 * - generateStartingPrompt - A function that generates the starting prompt.
 * - GenerateStartingPromptInput - The input type for the generateStartingPrompt function.
 * - GenerateStartingPromptOutput - The return type for the generateStartingPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStartingPromptInputSchema = z.object({
  userPrompt: z.string().describe('A short prompt from the user to start the mentoring experience.'),
});
export type GenerateStartingPromptInput = z.infer<typeof GenerateStartingPromptInputSchema>;

const GenerateStartingPromptOutputSchema = z.object({
  aiResponse: z.string().describe('The AI-generated response to the user prompt.'),
});
export type GenerateStartingPromptOutput = z.infer<typeof GenerateStartingPromptOutputSchema>;

export async function generateStartingPrompt(input: GenerateStartingPromptInput): Promise<GenerateStartingPromptOutput> {
  return generateStartingPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStartingPromptPrompt',
  input: {schema: GenerateStartingPromptInputSchema},
  output: {schema: GenerateStartingPromptOutputSchema},
  prompt: `You are a personalized mentoring AI. A user has provided the following prompt: {{{userPrompt}}}.  Generate a helpful and motivational response to start a personalized mentoring experience.`,
});

const generateStartingPromptFlow = ai.defineFlow(
  {
    name: 'generateStartingPromptFlow',
    inputSchema: GenerateStartingPromptInputSchema,
    outputSchema: GenerateStartingPromptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
