import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import RecipeBox from '../pages/RecipeBox';
import RecipeForm from '../pages/RecipeForm';
import Suggest from '../pages/Suggest';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/recipes" element={<RecipeBox />} />
      <Route path="/recipes/new" element={<RecipeForm />} />
      <Route path="/recipes/:id/edit" element={<RecipeForm />} />
      <Route path="/suggest" element={<Suggest />} />
    </Routes>
  );
}