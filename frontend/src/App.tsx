import { Routes, Route, Navigate } from 'react-router-dom';
import BenefitListPage from './pages/BenefitListPage';
import BenefitDetailPage from './pages/BenefitDetailPage';
import Layout from './components/layout/Layout';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Перенаправляем с главной на страницу со списком */}
        <Route index element={<Navigate to="/beneficios" replace />} />
        <Route path="beneficios" element={<BenefitListPage />} />
        <Route path="beneficios/:id" element={<BenefitDetailPage />} />
        <Route path="*" element={<h2>404 - Страница не найдена</h2>} />
      </Route>
    </Routes>
  );
}

export default App;