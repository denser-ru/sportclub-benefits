import axios from "axios";

export interface Benefit {
  id: number;
  nombre: string;
  descripcion: string;
  descuento: number | null;
  activo: boolean;
}

// ДОБАВЬТЕ `export`
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchBenefits = async (): Promise<Benefit[]> => {
  const response = await apiClient.get<Benefit[]>("/beneficios");
  return response.data.filter((benefit) => benefit.activo);
};

export const fetchBenefitById = async (id: string): Promise<Benefit> => {
  const response = await apiClient.get<Benefit>(`/beneficios/${id}`);
  return response.data;
};