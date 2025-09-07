'use server';

import {
  factBasedAIMentoring,
  type FactBasedAIMentoringInput,
} from '@/ai/flows/fact-based-ai-mentoring';
import { z } from 'zod';

const actionSchema = z.object({
  query: z.string(),
  history: z.array(
    z.object({
      role: z.enum(['user', 'ai']),
      content: z.string(),
    })
  ),
});

export async function getAiResponse(input: {
  query: string;
  history: any[];
}) {
  const validation = actionSchema.safeParse(input);
  if (!validation.success) {
    return { error: 'Invalid input' };
  }

  const { query, history } = validation.data;

  try {
    const aiInput: FactBasedAIMentoringInput = { query, history };
    const result = await factBasedAIMentoring(aiInput);
    return { response: result.response };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to get AI response.' };
  }
}
