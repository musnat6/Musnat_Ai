import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export interface ChatMessageProps {
  role: 'user' | 'ai';
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isAi = role === 'ai';

  return (
    <div
      className={cn(
        'flex items-start gap-4',
        isAi ? 'justify-start' : 'justify-end'
      )}
    >
      {isAi && (
        <Avatar className="h-8 w-8 border">
          <AvatarFallback className="bg-secondary">
            <Bot className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
      <Card
        className={cn(
          'max-w-xl rounded-2xl',
          isAi
            ? 'rounded-tl-none bg-muted'
            : 'rounded-tr-none bg-primary text-primary-foreground'
        )}
      >
        <CardContent className="p-3">
          {isAi ? (
            <ReactMarkdown
              className="prose prose-sm dark:prose-invert max-w-none break-words"
              remarkPlugins={[remarkGfm]}
            >
              {content}
            </ReactMarkdown>
          ) : (
            <p className="text-sm leading-relaxed">{content}</p>
          )}
        </CardContent>
      </Card>
      {!isAi && (
        <Avatar className="h-8 w-8 border">
          <AvatarFallback className="bg-secondary">
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}

export function LoadingChatMessage() {
  return (
    <div className="flex items-start justify-start gap-4">
      <Avatar className="h-8 w-8 border">
        <AvatarFallback className="bg-secondary">
          <Bot className="h-5 w-5" />
        </AvatarFallback>
      </Avatar>
      <Card className="max-w-xl rounded-2xl rounded-tl-none bg-muted">
        <CardContent className="p-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 animate-pulse rounded-full bg-foreground/50 delay-0" />
            <span className="h-2 w-2 animate-pulse rounded-full bg-foreground/50 delay-150" />
            <span className="h-2 w-2 animate-pulse rounded-full bg-foreground/50 delay-300" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
