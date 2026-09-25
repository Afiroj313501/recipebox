import { useEffect, useState } from 'react';

export default function Home() {
  const [status, setStatus] = useState('checking...');

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;

    fetch(`${apiUrl}/api/health`)
      .then((res) => res.json())
      .then((data) => setStatus(data.status === 'ok' ? 'connected ✅' : 'unexpected response'))
      .catch(() => setStatus('not connected ❌'));
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#FFF8F0]">
      <h1 className="text-4xl font-bold text-[#E63946]">
        Recipe Box 🍳
      </h1>
      <p className="text-gray-600">
        API status: <span className="font-mono">{status}</span>
      </p>
    </div>
  );
}