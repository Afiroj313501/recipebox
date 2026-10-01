import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Sparkles, ShoppingCart, User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function BottomTabBar() {
  const location = useLocation();
  const user = useAuthStore((s) => s.user);

  if (!user) return null; // only show once logged in

  const tabs = [
    { to: '/recipes', icon: BookOpen, label: 'Box' },
    { to: '/explore', icon: Home, label: 'Explore' },
    { to: '/suggest', icon: Sparkles, label: 'Suggest' },
    { to: '/shopping-list', icon: ShoppingCart, label: 'List' },
    { to: `/users/${user._id}`, icon: User, label: 'Profile' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-20 bg-white dark:bg-[#1D1D1D] border-t border-gray-200 dark:border-gray-800 flex justify-around py-2">
      {tabs.map(({ to, icon: Icon, label }) => {
        const active = location.pathname === to || location.pathname.startsWith(to + '/');
        return (
          <Link
            key={to}
            to={to}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 text-xs ${
              active ? 'text-[#E63946]' : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            <Icon size={20} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}