import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { loginUser, registerUser } from '../api/auth';
import { useAuthStore } from '../store/authStore';

export default function AuthModal({ open, onOpenChange, defaultTab = 'login' }) {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '' });

  function handleSuccess(data, message) {
    setAuth(data.user, data.accessToken, data.refreshToken);
    toast.success(message);
    onOpenChange(false);
    navigate('/recipes');
  }

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => handleSuccess(data, `Welcome back, ${data.user.name}!`),
    onError: (err) => toast.error(err.response?.data?.error || 'Login failed'),
  });

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => handleSuccess(data, `Welcome, ${data.user.name}!`),
    onError: (err) => toast.error(err.response?.data?.error || 'Registration failed'),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-[#E63946]">Recipe Box</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue={defaultTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Log in</TabsTrigger>
            <TabsTrigger value="register">Sign up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                loginMutation.mutate(loginForm);
              }}
              className="space-y-3 pt-4"
            >
              <input
                type="email"
                placeholder="Email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E63946]"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E63946]"
                required
              />
              <Button type="submit" disabled={loginMutation.isPending} className="w-full">
                {loginMutation.isPending ? 'Logging in...' : 'Log in'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                registerMutation.mutate(registerForm);
              }}
              className="space-y-3 pt-4"
            >
              <input
                type="text"
                placeholder="Name"
                value={registerForm.name}
                onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E63946]"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={registerForm.email}
                onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E63946]"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={registerForm.password}
                onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E63946]"
                required
              />
              <Button type="submit" disabled={registerMutation.isPending} className="w-full">
                {registerMutation.isPending ? 'Creating account...' : 'Sign up'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}