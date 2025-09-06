import { MusnatAiLogo } from '@/components/musnat-ai-logo';

export function Header() {
  return (
    <header className="w-full border-b">
      <div className="container mx-auto flex h-16 items-center justify-start gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <MusnatAiLogo className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Musnat Ai
          </h1>
        </div>
      </div>
    </header>
  );
}
