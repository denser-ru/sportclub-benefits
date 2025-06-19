import { create } from "zustand";
import { persist } from "zustand/middleware";
import { fetchBenefits, fetchBenefitById, type Benefit } from "../api";

interface BenefitState {
  benefits: Benefit[];
  currentBenefit: Benefit | null;
  favoriteIds: number[];
  isListLoading: boolean;
  isDetailLoading: boolean;
  listError: string | null;
  detailError: string | null;
}

interface BenefitActions {
  fetchBenefits: () => Promise<void>;
  fetchBenefitById: (id: string) => Promise<void>;
  clearCurrentBenefit: () => void;
  toggleFavorite: (id: number) => void;
}

// Используем middleware для сохранения избранного в localStorage
export const useBenefitStore = create<BenefitState & { actions: BenefitActions }>()(
  persist(
    (set, get) => ({
      benefits: [],
      currentBenefit: null,
      favoriteIds: [],
      isListLoading: false,
      isDetailLoading: false,
      listError: null,
      detailError: null,
      actions: {
        fetchBenefits: async () => {
          set({ isListLoading: true, listError: null });
          try {
            const data = await fetchBenefits();
            set({ benefits: data, isListLoading: false });
          } catch (err) {
            const errorMessage =
              err instanceof Error
                ? err.message
                : "Не удалось загрузить список";
            set({ listError: errorMessage, isListLoading: false });
          }
        },
        fetchBenefitById: async (id: string) => {
          const existingBenefit = get().benefits.find((b) => b.id === Number(id));
          if (existingBenefit) {
            set({
              currentBenefit: existingBenefit,
              isDetailLoading: false,
              detailError: null,
            });
            return;
          }
          set({ isDetailLoading: true, detailError: null });
          try {
            const data = await fetchBenefitById(id);
            set({ currentBenefit: data, isDetailLoading: false });
          } catch (err) {
            const errorMessage =
              err instanceof Error
                ? err.message
                : "Не удалось найти преимущество";
            set({ detailError: errorMessage, isDetailLoading: false });
          }
        },
        clearCurrentBenefit: () => {
          set({ currentBenefit: null, detailError: null });
        },
        toggleFavorite: (id: number) => {
          const { favoriteIds } = get();
          const isFavorite = favoriteIds.includes(id);
          const newFavoriteIds = isFavorite
            ? favoriteIds.filter((favId) => favId !== id)
            : [...favoriteIds, id];
          set({ favoriteIds: newFavoriteIds });
        },
      },
    }),
    {
      name: "benefit-favorites-storage", // ключ в localStorage
      partialize: (state) => ({ favoriteIds: state.favoriteIds }), // сохраняем только избранное
    }
  )
);