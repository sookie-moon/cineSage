import { Clapperboard } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="py-4 px-6 border-b border-border">
      <div className="container mx-auto flex items-center gap-2">
        <Clapperboard className="h-8 w-8 text-primary" />
        <Link href="/" className="text-2xl font-bold tracking-tight text-foreground hover:text-primary transition-colors">
          CineSage
        </Link>
      </div>
    </header>
  );
}
