import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import AppRoutes from './routes/AppRoutes';
import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/themeStore';
import BottomTabBar from './components/BottomTabBar';
import { getMe } from './api/auth';

function App() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const setUser = useAuthStore((s) => s.setUser);
  const initTheme = useThemeStore((s) => s.initTheme);

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  // Keep the stored user in sync with the database (e.g. after a role change)
  useEffect(() => {
    if (!accessToken) return;
    getMe()
      .then((data) => setUser(data.user))
      .catch(() => {});
  }, [accessToken, setUser]);

  return (
    <BrowserRouter>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:bg-white focus:text-[#E63946] focus:px-4 focus:py-2 focus:rounded-lg focus:z-50"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main-content">
        <AppRoutes />
      </main>
      <BottomTabBar />
    </BrowserRouter>
  );
}

export default App;