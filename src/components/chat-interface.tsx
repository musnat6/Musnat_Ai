'use client';

import { getAiResponse } from '@/app/actions';
import {
  ChatMessage,
  type ChatMessageProps,
  LoadingChatMessage,
} from '@/components/chat-message';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { Bot, SendHorizonal, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  query: z.string().min(1, 'Message cannot be empty.'),
});

const starterPrompts = [
  'Give me a quote about leadership.',
  'Tell me a fun fact about cats.',
  "What is the summary of 'Artificial intelligence' on Wikipedia?",
  'Give me some advice for a new manager.',
];

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessageProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: '',
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const userMessage: ChatMessageProps = {
      role: 'user',
      content: values.query,
    };
    
    // Optimistically add user message.
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    form.reset();

    const result = await getAiResponse({
      query: values.query,
      history: newMessages.slice(0, -1), // Send history before new message
    });
    
    // We already added the user message, so we just need to add the AI one (or remove user message on failure)
    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Oh no! Something went wrong.',
        description: result.error,
      });
      // remove the user message if the call fails, and stop loading
      setMessages((prev) => prev.slice(0, prev.length - 1));
    } else {
      const aiMessage: ChatMessageProps = {
        role: 'ai',
        content: result.response ?? 'Sorry, I could not generate a response.',
      };
      setMessages((prev) => [...prev, aiMessage]);
    }
    setIsLoading(false);
  }

  const handleStarterPrompt = (prompt: string) => {
    form.setValue('query', prompt);
    // Directly call onSubmit without waiting for a form event
    onSubmit({ query: prompt });
  };

  return (
    <div className="flex h-full flex-col rounded-xl border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b p-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Bot className="h-5 w-5" />
          Chat
        </h2>
      </div>
      <div className="flex-1 space-y-6 overflow-y-auto p-4 md:p-6">
        {messages.length === 0 && !isLoading ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <Sparkles className="mb-4 h-16 w-16 text-primary" />
            <h2 className="text-2xl font-semibold">Musnat AI Mentor</h2>
            <p className="mt-2 text-muted-foreground">
              Your personal guide for motivation and leadership.
            </p>
            <div className="mt-8 grid w-full max-w-2xl grid-cols-1 gap-4 md:grid-cols-2">
              {starterPrompts.map((prompt, i) => (
                <Button
                  key={i}
                  variant="outline"
                  className="h-auto justify-start py-3 text-left"
                  onClick={() => handleStarterPrompt(prompt)}
                >
                  {prompt}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <ChatMessage
              key={index}
              role={message.role}
              content={message.content}
            />
          ))
        )}
        {isLoading && <LoadingChatMessage />}
        <div ref={messagesEndRef} />
      </div>
      <div className="rounded-b-xl border-t bg-background/50 p-4 md:p-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-start gap-4"
          >
            <FormField
              control={form.control}
              name="query"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Textarea
                      placeholder="Ask for advice, a quote, or a fun fact..."
                      className="resize-none"
                      rows={1}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          form.handleSubmit(onSubmit)();
                        }
                      }}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" size="icon" disabled={isLoading}>
              <SendHorizonal className="h-5 w-5" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
