import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import RecipeBox from '../pages/RecipeBox';
import RecipeForm from '../pages/RecipeForm';
import RecipeDetail from '../pages/RecipeDetail';
import Suggest from '../pages/Suggest';
import AdminPending from '../pages/AdminPending';
import Explore from '../pages/Explore';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/recipes" element={<RecipeBox />} />
      <Route path="/recipes/new" element={<RecipeForm />} />
      <Route path="/recipes/:id/edit" element={<RecipeForm />} />
      <Route path="/recipes/:id" element={<RecipeDetail />} />
      <Route path="/suggest" element={<Suggest />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/admin" element={<AdminPending />} />
      <Route path="/admin/pending" element={<AdminPending />} />
    </Routes>
  );
}