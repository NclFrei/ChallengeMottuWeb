import axios from "axios";

const API_URL = "http://10.0.2.2:5262/api/v1/Area";

export const createArea = async (nome: string, patioId: number, token: string) => {
  const response = await axios.post(
    API_URL,
    { nome, patioId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const updateArea = async (id: number, data: { nome?: string; descricao?: string; patioId: number }, token: string) => {
  const response = await axios.patch(`${API_URL}/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteArea = async (id: number, token: string) => {
  await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return true;
};
