import { useState } from 'react';
import { Button } from '@/components/ui/button';
import AuthModal from '../components/AuthModal';
import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom';

export default function Home() {
  const [authOpen, setAuthOpen] = useState(false);
  const user = useAuthStore((s) => s.user);

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-5xl md:text-6xl font-bold text-[#1D1D1D] mb-4">
        Tell me what's in your kitchen.
        <br />
        <span className="text-[#E63946]">I'll tell you what to cook.</span>
      </h1>
      <p className="text-lg text-gray-600 max-w-xl mb-8">
        Store your recipes, get AI-powered suggestions from what you already
        have, and build a shopping list for the rest — all in one place.
      </p>

      {user ? (
        <Button size="lg" asChild>
          <Link to="/suggest">Start cooking</Link>
        </Button>
      ) : (
        <Button size="lg" onClick={() => setAuthOpen(true)}>
          Get started — it's free
        </Button>
      )}

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} defaultTab="register" />
    </div>
  );
}