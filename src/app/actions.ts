'use server';

import {
  factBasedAIMentoring,
  type FactBasedAIMentoringInput,
} from '@/ai/flows/fact-based-ai-mentoring';
import {
  getPersonalizedMotivationalAdvice,
  type PersonalizedMotivationalAdviceInput,
} from '@/ai/flows/personalized-motivational-advice';
import { z } from 'zod';

const actionSchema = z.object({
  query: z.string(),
  model: z.enum(['fact-based', 'motivational']),
  history: z.array(
    z.object({
      role: z.enum(['user', 'ai']),
      content: z.string(),
    })
  ),
});

export async function getAiResponse(input: {
  query: string;
  model: 'fact-based' | 'motivational';
  history: any[];
}) {
  const validation = actionSchema.safeParse(input);
  if (!validation.success) {
    return { error: 'Invalid input' };
  }

  const { query, model, history } = validation.data;

  try {
    if (model === 'fact-based') {
      const aiInput: FactBasedAIMentoringInput = { query };
      const result = await factBasedAIMentoring(aiInput);
      return { response: result.response };
    } else {
      const historyString = history
        .map((m) => `${m.role}: ${m.content}`)
        .join('\n');
      const aiInput: PersonalizedMotivationalAdviceInput = {
        userPreferences: 'The user wants motivational and leadership advice.',
        conversationHistory: historyString,
      };
      const result = await getPersonalizedMotivationalAdvice(aiInput);
      return { response: result.advice };
    }
  } catch (e) {
    console.error(e);
    return { error: 'Failed to get AI response.' };
  }
}
