// ./frontend/src/pages/BenefitListPage.tsx
import React, { useEffect, useState, useMemo } from "react";
import { useBenefitStore } from "../store/benefitStore";
import BenefitCard from "../components/BenefitCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { useDebounce } from "../hooks/useDebounce";

const BenefitListPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const benefits = useBenefitStore((state) => state.benefits);
  const isListLoading = useBenefitStore((state) => state.isListLoading);
  const listError = useBenefitStore((state) => state.listError);
  const fetchBenefitsAction = useBenefitStore(
    (state) => state.actions.fetchBenefits
  );

  useEffect(() => {
    if (benefits.length === 0) {
      fetchBenefitsAction();
    }
  }, [fetchBenefitsAction, benefits.length]);

  const filteredBenefits = useMemo(() => {
    if (!debouncedSearchTerm) {
      return benefits;
    }
    return benefits.filter((benefit) =>
      benefit.nombre.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [benefits, debouncedSearchTerm]);

  return (
    // Используем <section> для группировки связанного контента
    <section>
      <h1>Наши Преимущества</h1>
      <p>Выберите преимущество, чтобы узнать больше.</p>
      
      {/* Связываем <label> с <input> для улучшения доступности */}
      <label htmlFor="benefit-search" style={{ display: 'none' }}>
        Поиск по названию
      </label>
      <input
        id="benefit-search"
        type="text"
        className="filter-input"
        placeholder="Поиск по названию..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ErrorMessage message={listError} />

      {isListLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {filteredBenefits.length > 0 ? (
            <div className="benefits-grid">
              {filteredBenefits.map((benefit) => (
                <BenefitCard key={benefit.id} benefit={benefit} />
              ))}
            </div>
          ) : (
            <p style={{ marginTop: "2rem" }}>
              {debouncedSearchTerm
                ? `По запросу "${debouncedSearchTerm}" ничего не найдено.`
                : "На данный момент активные преимущества не найдены."}
            </p>
          )}
        </>
      )}
    </section>
  );
};

export default BenefitListPage;