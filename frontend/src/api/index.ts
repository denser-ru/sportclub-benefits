import axios from "axios";

export interface Benefit {
  id: number;
  // These fields are in Spanish as they match the external API contract
  nombre: string;
  descripcion: string;
  descuento: number | null;
  activo: boolean;
}

export const apiClient = axios.create({
  // Use VITE_API_URL from .env, or fallback for local development
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchBenefits = async (): Promise<Benefit[]> => {
  const response = await apiClient.get<Benefit[]>("/beneficios");
  // The frontend should only display active benefits on the main list
  return response.data.filter((benefit) => benefit.activo);
};

export const fetchBenefitById = async (id: string): Promise<Benefit> => {
  const response = await apiClient.get<Benefit>(`/beneficios/${id}`);
  return response.data;
};