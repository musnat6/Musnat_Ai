'use client';

import { getAiResponse } from '@/app/actions';
import {
  ChatMessage,
  type ChatMessageProps,
  LoadingChatMessage,
} from '@/components/chat-message';
import { MusnatAiLogo } from '@/components/musnat-ai-logo';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { Bot, SendHorizonal } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  query: z.string().min(1, 'Message cannot be empty.'),
});

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
    const userMessage: ChatMessageProps = {
      role: 'user',
      content: values.query,
    };
    
    // Add user message and set loading state.
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    form.reset();

    const result = await getAiResponse({
      query: values.query,
      history: messages, // Send full history
    });
    
    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Oh no! Something went wrong.',
        description: result.error,
      });
      // remove the user message if the call fails
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

  return (
    <div className="flex h-full flex-col rounded-xl border bg-card shadow-2xl shadow-primary/10">
      <div className="flex items-center justify-between border-b p-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Bot className="h-5 w-5" />
          Chat
        </h2>
      </div>
      <div className="flex-1 space-y-6 overflow-y-auto p-4">
        {messages.length === 0 && !isLoading ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <MusnatAiLogo className="mb-4 h-16 w-16 text-primary" />
            <h2 className="text-2xl font-semibold">Musnat AI Mentor</h2>
            <p className="mt-2 text-muted-foreground">
              Built by Musnat
            </p>
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
      <div className="rounded-b-xl border-t bg-background/50 p-2 sm:p-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-start gap-2 sm:gap-4"
          >
            <FormField
              control={form.control}
              name="query"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Textarea
                      placeholder="Ask anything to Musnat"
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
