import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AuthModal from './AuthModal';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';

export default function Navbar() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState('login');
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);

  function openAuth(tab) {
    setAuthTab(tab);
    setAuthOpen(true);
  }

  return (
    <nav className="sticky top-0 z-10 bg-white dark:bg-[#1D1D1D] border-b border-gray-200 dark:border-gray-800 px-6 py-3 flex items-center gap-6">
      <Link to="/" className="font-bold text-[#E63946] text-lg">
        Recipe Box
      </Link>

      {user && (
        <>
          <Link to="/explore" className="text-sm text-gray-700 dark:text-gray-300 hover:text-[#E63946]">
            Explore
          </Link>
          <Link to="/recipes" className="text-sm text-gray-700 dark:text-gray-300 hover:text-[#E63946]">
            Recipe Box
          </Link>
          <Link to="/suggest" className="text-sm text-gray-700 dark:text-gray-300 hover:text-[#E63946]">
            Suggest
          </Link>
          <Link to="/shopping-list" className="text-sm text-gray-700 dark:text-gray-300 hover:text-[#E63946]">
            Shopping List
          </Link>
          {user.role === 'admin' && (
            <Link to="/admin" className="text-sm text-gray-700 dark:text-gray-300 hover:text-[#E63946]">
              Admin
            </Link>
          )}
          <Link to={`/users/${user._id}`} className="text-sm text-gray-700 dark:text-gray-300 hover:text-[#E63946]">
            My Profile
          </Link>
        </>
      )}

      <div className="ml-auto flex items-center gap-3">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          className="text-gray-500 hover:text-[#E63946] dark:text-gray-400 dark:hover:text-[#E63946]"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {user ? (
          <>
            <span className="text-sm text-gray-600 dark:text-gray-300">Hi, {user.name}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                logout();
                navigate('/');
              }}
            >
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