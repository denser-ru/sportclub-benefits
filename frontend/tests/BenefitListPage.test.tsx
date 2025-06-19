import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { apiClient } from "../src/api";
import BenefitListPage from "../src/pages/BenefitListPage";
import { useBenefitStore } from "../src/store/benefitStore";

vi.mock("axios");

const renderWithRouter = (ui: React.ReactElement) => {
  return render(ui, { wrapper: BrowserRouter });
};

describe("BenefitListPage", () => {
  const mockBenefits = [
    { id: 1, nombre: "Скидка на фитнес-бар", descripcion: "...", activo: true, descuento: 15 },
    { id: 2, nombre: "Бесплатное полотенце", descripcion: "...", activo: true, descuento: null },
  ];

  // --- ФИНАЛЬНОЕ ИСПРАВЛЕНИЕ ---
  // 1. Захватываем чистое состояние ОДИН РАЗ до начала всех тестов.
  const initialState = useBenefitStore.getState();

  // 2. Перед каждым тестом используем этот "чистый" снимок для сброса.
  beforeEach(() => {
    useBenefitStore.setState(initialState, true);
  });
  // --------------------------------

  it("должен показывать загрузку, затем отрендерить активные преимущества", async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: mockBenefits });
    renderWithRouter(<BenefitListPage />);

    expect(screen.getByRole("status")).toHaveTextContent(/Загрузка.../i);

    const benefitCards = await screen.findAllByRole("article");
    expect(benefitCards).toHaveLength(2);
    expect(screen.getByText("Скидка на фитнес-бар")).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
  
  it("должен показывать сообщение об ошибке при неудачной загрузке", async () => {
    const errorMessage = "Сервис временно недоступен";
    vi.mocked(apiClient.get).mockRejectedValue(new Error(errorMessage));
    renderWithRouter(<BenefitListPage />);

    const errorElement = await screen.findByText(`Ошибка: ${errorMessage}`);
    expect(errorElement).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  describe("Фильтрация", () => {
    // Этот beforeEach подготавливает данные специально для тестов фильтрации,
    // он выполняется ПОСЛЕ общего beforeEach.
    beforeEach(async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ data: mockBenefits });
      renderWithRouter(<BenefitListPage />);
      await screen.findByText("Скидка на фитнес-бар");
    });
    
    it("должен корректно фильтровать преимущества", async () => {
      const user = userEvent.setup();
      const searchInput = screen.getByLabelText(/Поиск по названию/i);
      await user.type(searchInput, "полотенце");

      await waitFor(() => {
        expect(screen.queryByText("Скидка на фитнес-бар")).not.toBeInTheDocument();
        expect(screen.getByText("Бесплатное полотенце")).toBeInTheDocument();
      });
    });

    it('должен показывать сообщение "ничего не найдено", если фильтр не дал результатов', async () => {
      const user = userEvent.setup();
      const searchInput = screen.getByLabelText(/Поиск по названию/i);
      await user.type(searchInput, "несуществующий поиск");
  
      await waitFor(() => {
        expect(screen.queryByRole("article")).not.toBeInTheDocument();
        expect(screen.getByText(/По запросу "несуществующий поиск" ничего не найдено/i)).toBeInTheDocument();
      });
    });
  });
});