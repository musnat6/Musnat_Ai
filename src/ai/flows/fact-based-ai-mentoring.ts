'use server';
/**
 * @fileOverview A fact-based AI mentoring flow that uses external APIs to provide credible and engaging responses.
 *
 * - factBasedAIMentoring - A function that orchestrates the AI mentoring process.
 * - FactBasedAIMentoringInput - The input type for the factBasedAIMentoring function.
 * - FactBasedAIMentoringOutput - The return type for the factBasedAIMentoring function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FactBasedAIMentoringInputSchema = z.object({
  query: z.string().describe('The user query to provide a response to.'),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'ai']),
        content: z.string(),
      })
    )
    .describe('The history of the conversation.'),
});
export type FactBasedAIMentoringInput = z.infer<typeof FactBasedAIMentoringInputSchema>;

const FactBasedAIMentoringOutputSchema = z.object({
  response: z.string().describe('The AI generated response.'),
});
export type FactBasedAIMentoringOutput = z.infer<typeof FactBasedAIMentoringOutputSchema>;

export async function factBasedAIMentoring(input: FactBasedAIMentoringInput): Promise<FactBasedAIMentoringOutput> {
  return factBasedAIMentoringFlow(input);
}

const getWikipediaSummary = ai.defineTool({
  name: 'getWikipediaSummary',
  description: 'Returns a summary from Wikipedia for a given search term. Use this for very specific or niche topics.',
  inputSchema: z.object({
    searchTerm: z.string().describe('The term to search for on Wikipedia.'),
  }),
  outputSchema: z.string(),
}, async (input) => {
  const apiUrl = `https://en.wikipedia.org/api/rest_v1/summary/${encodeURIComponent(input.searchTerm)}`;
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      return `I couldn't find any information about "${input.searchTerm}" on Wikipedia.`;
    }
    const data = await response.json();
    return data.extract || 'No summary found.';
  } catch (error) {
    console.error('Error fetching Wikipedia summary:', error);
    return 'Failed to retrieve Wikipedia summary.';
  }
});

const getNumberTrivia = ai.defineTool({
  name: 'getNumberTrivia',
  description: 'Returns a trivia fact about a given number.',
  inputSchema: z.object({
    number: z.number().describe('The number to get trivia for.'),
  }),
  outputSchema: z.string(),
}, async (input) => {
  const apiUrl = `http://numbersapi.com/${input.number}`;
  try {
    const response = await fetch(apiUrl);
    return await response.text();
  } catch (error) {
    console.error('Error fetching number trivia:', error);
    return 'Failed to retrieve number trivia.';
  }
});

const getAdviceSlip = ai.defineTool({
  name: 'getAdviceSlip',
  description: 'Returns a random advice slip.',
  outputSchema: z.string(),
  inputSchema: z.object({}),
}, async () => {
  const apiUrl = `https://api.adviceslip.com/advice`;
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.slip.advice;
  } catch (error) {
    console.error('Error fetching advice slip:', error);
    return 'Failed to retrieve advice slip.';
  }
});

const getTypeFitQuote = ai.defineTool({
  name: 'getTypeFitQuote',
  description: 'Returns a quote from the Type.fit Quotes API.',
  outputSchema: z.object({text: z.string(), author: z.string()}),
  inputSchema: z.object({}),
}, async () => {
  const apiUrl = `https://type.fit/api/quotes`;
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const quote = data[Math.floor(Math.random() * data.length)];
    return {text: quote.text, author: quote.author};
  } catch (error) {
    console.error('Error fetching Type.fit quote:', error);
    return {text: 'Failed to retrieve quote.', author: 'Unknown'};
  }
});

const getZenQuote = ai.defineTool({
  name: 'getZenQuote',
  description: 'Returns a quote from the ZenQuotes API.',
  inputSchema: z.object({}),
  outputSchema: z.object({q: z.string(), a: z.string()}),
}, async () => {
  const apiUrl = `https://zenquotes.io/api/random`;
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return {q: data[0].q, a: data[0].a};
  } catch (error) {
    console.error('Error fetching ZenQuote:', error);
    return {q: 'Failed to retrieve quote.', a: 'Unknown'};
  }
});

const getCatFact = ai.defineTool({
  name: 'getCatFact',
  description: 'Returns a random fact about cats.',
  outputSchema: z.string(),
  inputSchema: z.object({}),
}, async () => {
  const apiUrl = `https://catfact.ninja/fact`;
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.fact;
  } catch (error) {
    console.error('Error fetching cat fact:', error);
    return 'Failed to retrieve cat fact.';
  }
});

const factBasedAIMentoringPrompt = ai.definePrompt({
  name: 'factBasedAIMentoringPrompt',
  input: {schema: FactBasedAIMentoringInputSchema},
  output: {schema: FactBasedAIMentoringOutputSchema},
  tools: [getWikipediaSummary, getNumberTrivia, getAdviceSlip, getTypeFitQuote, getZenQuote, getCatFact],
  prompt: `You are Musnat AI, a mentoring bot that provides motivational, leadership-driven advice. You also have a vast internal knowledge base and can access data from various APIs like Wikipedia, Numbers, Type.fit Quotes, ZenQuotes, Advice Slip and Cat Facts to make your responses credible and engaging.

  When responding to sensitive topics such as expressions of pain, distress, or personal struggle, adopt a supportive and empathetic tone. Acknowledge the user's feelings and offer encouragement. IMPORTANT: You must also include a disclaimer that you are an AI and not a medical or mental health professional, and that the user should consult with a qualified professional for help. Do not give medical advice.
  
  For general knowledge questions (e.g., 'What is ChatGPT?', 'Who is Albert Einstein?'), you should rely on your own extensive internal knowledge first. Only use the getWikipediaSummary tool if the topic is very obscure or you cannot find the information internally.
  
  You should use the conversation history to inform your response.
  
  {{#if history}}
  Conversation History:
  {{#each history}}
  - {{role}}: {{content}}
  {{/each}}
  {{/if}}

  Make sure to use your internal knowledge or the provided tools to gather relevant information to answer the user's query.
  User query: {{{query}}}`,
});

const factBasedAIMentoringFlow = ai.defineFlow(
  {
    name: 'factBasedAIMentoringFlow',
    inputSchema: FactBasedAIMentoringInputSchema,
    outputSchema: FactBasedAIMentoringOutputSchema,
  },
  async input => {
    const {output} = await factBasedAIMentoringPrompt(input);
    return output!;
  }
);
