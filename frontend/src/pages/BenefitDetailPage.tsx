// ./frontend/src/pages/BenefitDetailPage.tsx
import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useBenefitStore } from "../store/benefitStore";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

const BenefitDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const currentBenefit = useBenefitStore((state) => state.currentBenefit);
  const isDetailLoading = useBenefitStore((state) => state.isDetailLoading);
  const detailError = useBenefitStore((state) => state.detailError);
  const favoriteIds = useBenefitStore((state) => state.favoriteIds);
  const actions = useBenefitStore((state) => state.actions);

  useEffect(() => {
    if (id) {
      actions.fetchBenefitById(id);
    }
    return () => {
      actions.clearCurrentBenefit();
    };
  }, [id, actions]);

  if (isDetailLoading) {
    return <LoadingSpinner />;
  }

  if (detailError) {
    return (
      <div>
        <ErrorMessage message={detailError} />
        <br />
        <Link to="/beneficios" className="text-link">
          Вернуться к списку
        </Link>
      </div>
    );
  }

  if (!currentBenefit) {
    return null;
  }

  const isFavorite = favoriteIds.includes(currentBenefit.id);

  return (
    // Используем <article> для семантической разметки основного контента страницы
    <article className="detail-page-content">
      <h1>{currentBenefit.nombre}</h1>
      <p>{currentBenefit.descripcion}</p>
      {currentBenefit.descuento && (
        <p>
          <strong>Скидка: {currentBenefit.descuento}%</strong>
        </p>
      )}
      <p>
        <strong>Статус:</strong> {currentBenefit.activo ? "Активно" : "Неактивно"}
      </p>

      <button
        onClick={() => actions.toggleFavorite(currentBenefit.id)}
        className={`action-button ${isFavorite ? "remove" : ""}`}
      >
        {isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
      </button>

      <div style={{ marginTop: "2rem" }}>
        <Link to="/beneficios" className="text-link">
          ← Назад к списку
        </Link>
      </div>
    </article>
  );
};

export default BenefitDetailPage;