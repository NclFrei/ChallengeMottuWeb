# Challenge Mottu Web

Frontend desenvolvido em **React Native** para consumir a API [MottuChallenge.API](https://github.com/NclFrei/MottuChallenge.API).  
O sistema permite que o usuário gerencie **Pátios**, **Áreas** e **Motos**, de forma simples e intuitiva.

---

## 📌 Funcionalidades

- 🔑 Autenticação e login do usuário  
- 🏢 Cadastro e edição de **Pátios**  
- 🗂️ Gerenciamento de **Áreas** dentro de cada pátio  
- 🏍️ Associação de **Motos** a uma área específica  
- 📋 Listagem detalhada das entidades (pátio → áreas → motos)  
- 📱 Interface responsiva e amigável  

---

## ⚙️ Instalação e Execução

### Pré-requisitos
- Node.js (>= 18.x)  
- npm ou yarn  

### Passos

```bash
# clonar o repositório
git clone https://github.com/NclFrei/ChallengeMottuWeb.git

# entrar na pasta
cd ChallengeMottuWeb

# instalar dependências
npm install
# ou
yarn install

# rodar em modo de desenvolvimento
npm start 
# ou
yarn start
```

A aplicação estará disponível em:  
👉 `http://localhost:3000` 

---


## 📂 Estrutura de Pastas ()

```
📂 Estrutura de Pastas
.
├── App.js
├── app.json
├── app/                    # Expo Router (navegação por pastas)
│   ├── (tabs)/             # Telas em abas
│   │   ├── cadastroScreen.tsx
│   │   └── patioScreen.tsx
│   ├── CadastroScreenUser.tsx
│   ├── editUserScreen.tsx
│   └── index.tsx
├── src/
│   ├── components/         # Componentes reutilizáveis
│   │   ├── AreaList.tsx
│   │   ├── EditAreaModal.tsx
│   │   ├── EditMotoModal.tsx
│   │   ├── Header.tsx
│   │   ├── MotoList.tsx
│   │   └── PatioCard.tsx
│   ├── context/            # Contextos globais
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   └── services/           # Serviços de integração com API
│       ├── areaService.tsx
│       ├── motoService.tsx
│       ├── patioService.tsx
│       └── userService.tsx
├── tsconfig.json
└── package.json
```

---

## 👤 Autores

- RM557647 - Nicollas Frei
- RM554921 - Eduardo Eiki
- RM558208 - Heitor Pereira Duarte
