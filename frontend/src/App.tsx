import { Routes, Route, Navigate } from 'react-router-dom';
import BenefitListPage from './pages/BenefitListPage';
import BenefitDetailPage from './pages/BenefitDetailPage';
import Layout from './components/layout/Layout';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Redirect from the root to the benefits list page */}
        <Route index element={<Navigate to="/beneficios" replace />} />
        <Route path="beneficios" element={<BenefitListPage />} />
        <Route path="beneficios/:id" element={<BenefitDetailPage />} />
        <Route path="*" element={<h2>404 - Page Not Found</h2>} />
      </Route>
    </Routes>
  );
}

export default App;