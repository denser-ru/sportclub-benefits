import React from "react";
import { Link } from "react-router-dom";
import type { Benefit } from "../api";
import { useBenefitStore } from "../store/benefitStore";

interface BenefitCardProps {
  benefit: Benefit;
}

const BenefitCard: React.FC<BenefitCardProps> = ({ benefit }) => {
  const favoriteIds = useBenefitStore((state) => state.favoriteIds);
  const isFavorite = favoriteIds.includes(benefit.id);
  const shortDescription = benefit.descripcion.substring(0, 100) + "...";

  return (
    <article>
      <Link
        to={`/beneficios/${benefit.id}`}
        style={{ textDecoration: "none", color: "inherit" }}
        aria-label={`Learn more about ${benefit.nombre}`}
      >
        <div className="benefit-card">
          {isFavorite && (
            // Hide the decorative icon from screen readers
            <div className="favorite-indicator" aria-hidden="true">
              ⭐
            </div>
          )}
          <img
            className="benefit-card-image"
            src={`https://placehold.co/400x200/2c3e50/ecf0f1?text=Benefit`}
            alt={`${benefit.nombre}`}
          />
          <div className="benefit-card-content">
            <h3>{benefit.nombre}</h3>
            <p>{shortDescription}</p>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default BenefitCard;