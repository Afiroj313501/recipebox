import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import RecipeBox from '../pages/RecipeBox';
import Suggest from '../pages/Suggest';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/recipes" element={<RecipeBox />} />
      <Route path="/suggest" element={<Suggest />} />
    </Routes>
  );
}