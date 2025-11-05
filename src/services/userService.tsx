export async function fetchUser(id: number, token: string) {
  const response = await fetch(`http://10.0.2.2:5262/api/v1/User/${id}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao carregar usuário");
  }
  return response.json();
}

export async function updateUser(id: number, token: string, data: Partial<{ nome: string; email: string; password: string }>) {
  const response = await fetch(`http://10.0.2.2:5262/api/v1/User/${id}`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Erro ao atualizar usuário");
  }
  return response.json();
}
