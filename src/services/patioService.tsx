export async function fetchPatios(userId: number, token: string) {
  console.log("Buscando pátios para o usuário:", userId);

  try {
    const response = await fetch(
      `http://10.0.2.2:5262/api/v1/Patio/Userid/${userId}`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`, 
          "Content-Type": "application/json",
        },
      }
    );

    // Log do status da resposta
    console.log("Status da resposta:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erro ao buscar pátios:", errorText);
      throw new Error(`Erro ao buscar pátios: ${response.status}`);
    }

    const data = await response.json();
    console.log("Resposta da API:", data); 
    return data;

  } catch (error) {
    console.error("Erro no fetchPatios:", error);
    throw error;
  }
}

export async function createPatio(patioData: any, token: string) {
  console.log("Cadastrando novo pátio:", patioData);
  try {
    const response = await fetch(`http://10.0.2.2:5262/api/v1/Patio`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(patioData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ao cadastrar pátio: ${errorText}`);
    }

    return await response.json();
  } catch (err) {
    console.error("Erro no createPatio:", err);
    throw err;
  }
}