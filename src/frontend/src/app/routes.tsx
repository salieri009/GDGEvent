import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from '@/features/home/pages/HomePage';
import PetsListPage from '@/features/pets/pages/PetsListPage';
import PetDetailPage from '@/features/pets/pages/PetDetailPage';
import AdoptPage from '@/features/adoption/pages/AdoptPage';
import AdminLoginPage from '@/features/admin/pages/AdminLoginPage';
import AdminApplicationsPage from '@/features/admin/pages/AdminApplicationsPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/pets" element={<PetsListPage />} />
      <Route path="/pet/:id" element={<PetDetailPage />} />
      <Route path="/adopt/:id" element={<AdoptPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin/applications" element={<AdminApplicationsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
