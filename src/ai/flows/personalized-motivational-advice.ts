// src/ai/flows/personalized-motivational-advice.ts
'use server';

/**
 * @fileOverview Provides personalized motivational advice based on user preferences and past conversations.
 *
 * This file exports:
 * - `getPersonalizedMotivationalAdvice`: Function to retrieve personalized motivational advice.
 * - `PersonalizedMotivationalAdviceInput`: Input type for the function.
 * - `PersonalizedMotivationalAdviceOutput`: Output type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedMotivationalAdviceInputSchema = z.object({
  userPreferences: z.string().describe('User preferences and goals, stored as a string.'),
  conversationHistory: z.string().describe('History of previous conversations with the user, stored as a string.'),
});
export type PersonalizedMotivationalAdviceInput = z.infer<typeof PersonalizedMotivationalAdviceInputSchema>;

const PersonalizedMotivationalAdviceOutputSchema = z.object({
  advice: z.string().describe('Personalized motivational advice.'),
});
export type PersonalizedMotivationalAdviceOutput = z.infer<typeof PersonalizedMotivationalAdviceOutputSchema>;

export async function getPersonalizedMotivationalAdvice(
  input: PersonalizedMotivationalAdviceInput
): Promise<PersonalizedMotivationalAdviceOutput> {
  return personalizedMotivationalAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedMotivationalAdvicePrompt',
  input: {schema: PersonalizedMotivationalAdviceInputSchema},
  output: {schema: PersonalizedMotivationalAdviceOutputSchema},
  prompt: `You are Musnat.AI, a personalized AI mentor providing motivational and leadership-driven advice.

  Based on the user's preferences and goals, as well as the history of previous conversations, provide personalized advice that is relevant and impactful to their specific situation.

  User Preferences and Goals: {{{userPreferences}}}
  Conversation History: {{{conversationHistory}}}

  Provide advice in a clear, concise, and motivational manner.
  Keep advice short, under 100 words.
  `,
});

const personalizedMotivationalAdviceFlow = ai.defineFlow(
  {
    name: 'personalizedMotivationalAdviceFlow',
    inputSchema: PersonalizedMotivationalAdviceInputSchema,
    outputSchema: PersonalizedMotivationalAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
