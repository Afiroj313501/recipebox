import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import AppRoutes from './routes/AppRoutes';
import { useAuthStore } from './store/authStore';
import { getMe } from './api/auth';

function App() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const setUser = useAuthStore((s) => s.setUser);

  // Keep the stored user in sync with the database (e.g. after a role change)
  useEffect(() => {
    if (!accessToken) return;
    getMe()
      .then((data) => setUser(data.user))
      .catch(() => {});
  }, [accessToken, setUser]);

  return (
    <BrowserRouter>
      <Navbar />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;