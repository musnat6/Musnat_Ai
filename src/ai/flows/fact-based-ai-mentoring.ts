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
import * as cheerio from 'cheerio';


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

const getRecentNews = ai.defineTool({
  name: 'getRecentNews',
  description: 'Returns recent news articles for a given search query.',
  inputSchema: z.object({
    query: z.string().describe('The topic to search for recent news about.'),
  }),
  outputSchema: z.string(),
}, async (input) => {
  const url = `https://www.google.com/search?q=${encodeURIComponent(input.query)}&tbm=nws`;
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    let results = '';
    $('div.SoaBEf').slice(0, 5).each((i, el) => {
      const title = $(el).find('div.n0jPhd').text();
      const link = $(el).find('a').attr('href');
      const source = $(el).find('div.MgUUmf').text();
      const snippet = $(el).find('div.GI742b').text();
      if (title && link) {
        results += `Title: ${title}\nSource: ${source}\nSnippet: ${snippet}\nLink: ${link}\n\n`;
      }
    });
    return results || 'Could not find any recent news on that topic.';
  } catch (error) {
    console.error('Error fetching recent news:', error);
    return 'Failed to retrieve recent news.';
  }
});

const factBasedAIMentoringPrompt = ai.definePrompt({
  name: 'factBasedAIMentoringPrompt',
  input: {schema: FactBasedAIMentoringInputSchema},
  output: {schema: FactBasedAIMentoringOutputSchema},
  tools: [getWikipediaSummary, getNumberTrivia, getAdviceSlip, getTypeFitQuote, getZenQuote, getCatFact, getRecentNews],
  prompt: `You are Musnat AI, a highly advanced, empathetic, and knowledgeable AI companion. Your primary goal is to converse like a human—naturally, engagingly, and with awareness of the context and the user's emotional state.

Your personality:
- You are friendly, approachable, and have a good sense of humor when appropriate.
- You are curious and willing to learn.
- You can change your talking style based on the situation. If the user is joking, feel free to be playful. If they are serious, be more formal and direct. If they are distressed, be exceptionally gentle and supportive.

How you should respond:
- For general knowledge questions (e.g., 'What is ChatGPT?', 'Who is the president?'), use your internal knowledge base first. You have a vast store of information.
- For questions about recent events or news, use the 'getRecentNews' tool to provide up-to-date information.
- For very specific or niche topics, use the 'getWikipediaSummary' tool.
- Use your other tools (quotes, facts, advice) to enrich the conversation when it feels natural, not just for the sake of using them.
- **IMPORTANT**: Structure your responses using Markdown for clarity and readability. Use headings, bold text, lists, and emojis to make the information scannable and engaging. For example, when providing business ideas, group them under a bold heading and use a numbered list.

IMPORTANT: Handling sensitive topics:
- When a user expresses pain, distress, or personal struggle, your top priority is to be a supportive and empathetic friend. Acknowledge their feelings with warmth and sincerity.
- Offer comfort and encouragement, but DO NOT give medical or mental health advice.
- You MUST include a disclaimer that you are an AI and not a substitute for a qualified professional. Example: "I'm here to listen, but please remember I'm an AI. If you're struggling, talking to a therapist or a trusted professional can make a real difference."

Remember to always consider the entire conversation history to provide coherent and context-aware responses, just like a human would.

{{#if history}}
Conversation History:
{{#each history}}
- {{role}}: {{content}}
{{/each}}
{{/if}}

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
