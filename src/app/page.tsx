import { Header } from '@/components/header';
import { ChatInterface } from '@/components/chat-interface';

export default function Home() {
  return (
    <div className="flex flex-col h-dvh bg-background">
      <Header />
      <main className="flex-1 overflow-hidden p-2 sm:p-4">
        <ChatInterface />
      </main>
    </div>
  );
}
