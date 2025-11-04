import Link from 'next/link';

import { siteConfig } from '@/config/site';
import { buttonVariants } from '@/components/ui/button';

export default function IndexPage() {
  return (
    <div className="game-container">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h1 className="game-header mb-4">
            Tic Tac Toe Arena
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Challenge your friends in this epic multiplayer battle!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto p-8">
          <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border/50 hover:border-primary/50 transition-all duration-300">
            <h3 className="text-xl font-bold mb-2 text-primary">Real-time Multiplayer</h3>
            <p className="text-muted-foreground">Challenge players in intense real-time matches</p>
          </div>
          <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border/50 hover:border-secondary/50 transition-all duration-300">
            <h3 className="text-xl font-bold mb-2 text-secondary">Pro Gaming Interface</h3>
            <p className="text-muted-foreground">Modern and responsive gaming experience</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            href="/tictactoe"
            className="game-button"
          >
            Play Now
          </Link>
          <Link
            target="_blank"
            rel="noreferrer"
            href={siteConfig.links.github}
            className="px-8 py-4 text-lg font-bold rounded-xl border-2 border-border hover:bg-card/50 transition-all duration-300"
          >
            View on GitHub
          </Link>
        </div>
      </div>
    </div>
  );
}
