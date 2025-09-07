import Image from 'next/image';

export function Header() {
  return (
    <header className="w-full border-b">
      <div className="container mx-auto flex h-16 items-center justify-start gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <Image
            src="https://ucarecdn.com/aaa12892-c8ca-4224-b768-46c05616eafe/-/preview/1000x1000/"
            alt="Musnat AI Logo"
            width={32}
            height={32}
            className="h-8 w-8"
          />
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Musnat Ai
          </h1>
        </div>
      </div>
    </header>
  );
}
