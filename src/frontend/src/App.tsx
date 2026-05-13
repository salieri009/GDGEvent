/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import PetsList from './pages/PetsList';
import PetDetail from './pages/PetDetail';
import Adopt from './pages/Adopt';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pets" element={<PetsList />} />
          <Route path="/pet/:id" element={<PetDetail />} />
          <Route path="/adopt/:id" element={<Adopt />} />
          {/* Redirect any unknown routes to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

