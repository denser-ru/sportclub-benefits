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
          Back to list
        </Link>
      </div>
    );
  }

  if (!currentBenefit) {
    return null;
  }

  const isFavorite = favoriteIds.includes(currentBenefit.id);

  return (
    // Use <article> for semantic markup of the main page content
    <article className="detail-page-content">
      <h1>{currentBenefit.nombre}</h1>
      <p>{currentBenefit.descripcion}</p>
      {currentBenefit.descuento && (
        <p>
          <strong>Discount: {currentBenefit.descuento}%</strong>
        </p>
      )}
      <p>
        <strong>Status:</strong> {currentBenefit.activo ? "Active" : "Inactive"}
      </p>

      <button
        onClick={() => actions.toggleFavorite(currentBenefit.id)}
        className={`action-button ${isFavorite ? "remove" : ""}`}
      >
        {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
      </button>

      <div style={{ marginTop: "2rem" }}>
        <Link to="/beneficios" className="text-link">
          ← Back to List
        </Link>
      </div>
    </article>
  );
};

export default BenefitDetailPage;