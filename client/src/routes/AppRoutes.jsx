import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import RecipeBox from '../pages/RecipeBox';
import Suggest from '../pages/Suggest';
import Register from '../pages/Register';
import Login from '../pages/Login';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/recipes" element={<RecipeBox />} />
      <Route path="/suggest" element={<Suggest />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}