import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-6">
      <Link to="/" className="font-bold text-[#E63946] text-lg">
        Recipe Box
      </Link>
      <Link to="/recipes" className="text-sm text-gray-700 hover:text-[#E63946]">
        Recipe Box
      </Link>
      <Link to="/suggest" className="text-sm text-gray-700 hover:text-[#E63946]">
        Suggest
      </Link>
    </nav>
  );
}