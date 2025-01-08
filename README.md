# Hub Next.js

## Visão Geral do Projeto

**Hub Next.js** é uma aplicação web moderna construída com Next.js, TypeScript e Material UI para componentes e Storybook para documentação.

---

## Funcionalidades

- **Next.js**: Aplicações React rápidas com renderização no lado do servidor.
- **TypeScript**: Tipagem estática para uma melhor experiência de desenvolvimento.
- **TailwindCSS**: Framework CSS utilitário para estilização.
- **Material UI**: Componentes ricos em React para uma interface aprimorada.
- **Storybook**: Explorador de componentes para desenvolvimento e testes isolados.
- **Recharts**: Biblioteca para criação de gráficos.
- **React Hook Form**: Manipulação de formulários de forma performática e validações personalizadas.

---

## Estrutura de Pastas

```plaintext
/
├── .storybook/        # Configuração do Storybook
├── docker/            # Configuração relacionada ao Docker
├── public/            # Arquivos estáticos (ex.: imagens, ícones)
├── src/
│   ├── app/
│   │   ├── components/             # Componente reutilizaveis
│   │   ├── pages/                  # Telas da aplicação
│   ├── conf/
│   │   └── theme.ts               # Configuração de tema para o Material UI
├── .env.example       # Exemplo de variáveis de ambiente
├── .env.local         # Variáveis de ambiente locais

```

---

## Começando

### Pré-requisitos

- Node.js >= 22.x
- npm >= 11.x ou Yarn
- Docker

### Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/your-repo/hub-nextjs.git
   cd hub-nextjs
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   - Copie `.env.example` para `.env.local` e configure conforme necessário.

### Executando a Aplicação

- **Modo de desenvolvimento**:

  ```bash
  npm run dev
  ```

- **Build para produção**:

  ```bash
  npm run build
  ```

- **Executar o Storybook**:
  ```bash
  npm run storybook
  ```

---

### Executando com docker

Configurare as variaveis de ambiente acesse a pasta docker e rode o comando abaixo:

```bash
docker-compose up --build
```

---

## Scripts

| Comando             | Descrição                               |
| ------------------- | --------------------------------------- |
| `npm run dev`       | Executa o servidor de desenvolvimento   |
| `npm run build`     | Compila a aplicação para produção       |
| `npm run start`     | Inicia o servidor de produção           |
| `npm run lint`      | Executa o ESLint para análise de código |
| `npm run storybook` | Inicia o Storybook para desenvolvimento |

---

## Dependências

### Principais

- **[Next.js](https://nextjs.org/)**: Framework para aplicações React.
- **[React](https://reactjs.org/)**: Biblioteca de interface de usuário.
- **[TypeScript](https://www.typescriptlang.org/)**: JavaScript tipado.

### UI/UX

- **[Material UI](https://mui.com/)**: Componentes de interface.
- **[Recharts](https://recharts.org/)**: Gráficos e visualizações.

### Formulários e Validação

- **[React Hook Form](https://react-hook-form.com/)**: Manipulação e validação de formulários.

---
