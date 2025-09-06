import { Header } from '@/components/header';
import { ChatInterface } from '@/components/chat-interface';

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <Header />
      <main className="flex-1 overflow-hidden p-4 sm:p-6 lg:p-8">
        <ChatInterface />
      </main>
    </div>
  );
}
