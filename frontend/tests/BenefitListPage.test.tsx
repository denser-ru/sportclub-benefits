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
    { id: 1, nombre: "Fitness bar discount", descripcion: "...", activo: true, descuento: 15 },
    { id: 2, nombre: "Free towel", descripcion: "...", activo: true, descuento: null },
  ];

  // 1. Capture the initial clean state ONCE before all tests.
  const initialState = useBenefitStore.getState();

  // 2. Before each test, use this "clean" snapshot to reset the state.
  beforeEach(() => {
    useBenefitStore.setState(initialState, true);
  });

  it("should show loading, then render active benefits", async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: mockBenefits });
    renderWithRouter(<BenefitListPage />);

    expect(screen.getByRole("status")).toHaveTextContent(/Loading.../i);

    const benefitCards = await screen.findAllByRole("article");
    expect(benefitCards).toHaveLength(2);
    expect(screen.getByText("Fitness bar discount")).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
  
  it("should show an error message on a failed fetch", async () => {
    const errorMessage = "Service is temporarily unavailable";
    vi.mocked(apiClient.get).mockRejectedValue(new Error(errorMessage));
    renderWithRouter(<BenefitListPage />);

    const errorElement = await screen.findByText(`Error: ${errorMessage}`);
    expect(errorElement).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  describe("Filtering", () => {
    // This beforeEach prepares data specifically for the filtering tests;
    // it runs AFTER the general beforeEach.
    beforeEach(async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ data: mockBenefits });
      renderWithRouter(<BenefitListPage />);
      await screen.findByText("Fitness bar discount");
    });
    
    it("should filter benefits correctly", async () => {
      const user = userEvent.setup();
      const searchInput = screen.getByLabelText(/Search by name/i);
      await user.type(searchInput, "towel");

      await waitFor(() => {
        expect(screen.queryByText("Fitness bar discount")).not.toBeInTheDocument();
        expect(screen.getByText("Free towel")).toBeInTheDocument();
      });
    });

    it('should show a "not found" message if the filter yields no results', async () => {
      const user = userEvent.setup();
      const searchInput = screen.getByLabelText(/Search by name/i);
      await user.type(searchInput, "non-existent search");
  
      await waitFor(() => {
        expect(screen.queryByRole("article")).not.toBeInTheDocument();
        expect(screen.getByText(/No results found for "non-existent search"/i)).toBeInTheDocument();
      });
    });
  });
});