# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```


```
/frontend
└── src/
    ├── assets/
    │
    ├── components/ # <-- APENAS componentes de UI GENÉRICOS e REUTILIZÁVEIS
    │   ├── inputs/
    │   │   └── index.tsx          # Seus inputs (TypeInput, Selection, etc.)
    │   ├── layout/
    │   │   ├── Header.tsx         # O cabeçalho do site
    │   │   └── Footer.tsx         # O rodapé do site
    │   └── ui/
    │       ├── Button.tsx         # Um componente de botão genérico
    │       └── Spinner.tsx        # Um ícone de carregamento
    │
    ├── features/ # <-- CORAÇÃO DO PROJETO: Cada funcionalidade vive aqui
    │   ├── auth/                  # Lógica de autenticação
    │   │   └── auth.service.ts
    │   │
    │   ├── perspectives/
    │   │   ├── components/
    │   │   │   ├── FormPerspective/ # O formulário de admin
    │   │   │   │   ├── index.tsx
    │   │   │   │   ├── usePerspectiveForm.ts
    │   │   │   │   ├── ContentBlockEditor.tsx
    │   │   │   │   └── perspective.schema.ts
    │   │   │   └── PerspectiveDetail.tsx # A view de detalhe da perspectiva
    │   │   ├── perspective.service.ts
    │   │   └── perspective.types.ts
    │   │
    │   └── projects/
    │       ├── components/
    │       │   ├── FormProject/
    │       │   │   └── index.tsx
    │       │   ├── ProjectCard.tsx      # O card de um projeto na lista
    │       │   └── ProjectList.tsx      # A grade de projetos com o filtro
    │       ├── project.service.ts
    │       └── project.types.ts
    │
    ├── lib/ # Para código auxiliar, como a configuração do Axios
    │   └── axios.ts
    │
    ├── pages/ # <-- APENAS para definir as ROTAS e MONTAR as páginas
    │   ├── AdmManagementPage.tsx
    │   ├── HomePage.tsx
    │   ├── LoginPage.tsx
    │   ├── ProjectDetailPage.tsx
    │   └── ProjectsListPage.tsx
    │
    └── main.tsx # Arquivo principal que configura o ROTEAMENTO
´´´