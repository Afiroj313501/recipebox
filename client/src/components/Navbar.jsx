import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AuthModal from './AuthModal';
import { useAuthStore } from '../store/authStore';

export default function Navbar() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState('login');
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  function openAuth(tab) {
    setAuthTab(tab);
    setAuthOpen(true);
  }

  return (
    <nav className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-6">
      <Link to="/" className="font-bold text-[#E63946] text-lg">
        Recipe Box
      </Link>

      {user && (
        <>
          <Link to="/recipes" className="text-sm text-gray-700 hover:text-[#E63946]">
            Recipe Box
          </Link>
          <Link to="/suggest" className="text-sm text-gray-700 hover:text-[#E63946]">
            Suggest
          </Link>
        </>
      )}

      <div className="ml-auto flex items-center gap-3">
        {user ? (
          <>
            <span className="text-sm text-gray-600">Hi, {user.name}</span>
            <Button variant="outline" size="sm" onClick={logout}>
              Log out
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" size="sm" onClick={() => openAuth('login')}>
              Log in
            </Button>
            <Button size="sm" onClick={() => openAuth('register')}>
              Sign up
            </Button>
          </>
        )}
      </div>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} defaultTab={authTab} />
    </nav>
  );
}