import axios from "axios";

const API_URL = "http://10.0.2.2:5262/api/v1/Moto";

export const createMoto = async (placa: string, modelo: string, areaId: number, token: string) => {
  const response = await axios.post(
    API_URL,
    { placa, modelo, areaId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const updateMoto = async (id: number, data: { placa?: string; modelo?: string; areaId: number }, token: string) => {
  const response = await axios.patch(`${API_URL}/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteMoto = async (id: number, token: string) => {
  await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return true;
};
