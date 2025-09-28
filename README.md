# Sistema de Prescrição Inteligente de Treinos - Frontend

Repositório referente ao projeto final da cadeira de Programação Web 1

## Integrantes

- Mikael Brasileiro Ferreira de Almeida Amaral
- Lucas Oliveira Carvalho
- Cristian Alves da Silva
  
## Funcionalidades

- **Perfil do usuário**: coleta dados pessoais, experiência e condições de saúde
- **Prescrições**: gera planos de treino personalizados
- **Admin**: gerencia grupos musculares, exercícios e condições
- **Responsivo**: funciona bem no celular e desktop
- **Modo escuro**: tema claro/escuro
- **Offline**: funciona sem internet e sincroniza depois
- **API**: conecta com backend FastAPI

## Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- Git

## Instalação
1. **Clone o repositório**
   ```bash
   git clone https://github.com/Mikaelbfaa/Projeto-PWeb.git
   cd Projeto-PWeb/dr-personal-frontend
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

## Como rodar

```bash
npm run dev
```

Acesse em `http://localhost:5173`

## Scripts

- `npm run dev` - desenvolvimento
- `npm test` - testes
- `npm run build` - build para produção
- `npm run preview` - preview do build

## Estrutura

```
dr-personal-frontend/
├── src/
│   ├── components/
│   │   ├── admin/          # painel administrativo
│   │   ├── common/         # componentes gerais
│   │   ├── forms/          # formulários
│   │   └── prescription/   # prescrições
│   ├── context/            # contextos React
│   ├── hooks/              # custom hooks
│   ├── pages/              # páginas
│   ├── services/           # APIs e storage
│   ├── utils/              # utilitários
│   └── constants/          # configurações
└── ...
```

## Funcionalidades Implementadas

### Fluxo do Usuário
1. **Homepage** - Página inicial com apresentação do sistema
2. **Criação de Perfil** - Wizard de 4 etapas:
   - Dados Pessoais
   - Experiência de Treino
   - Valores de Força
   - Condições de Saúde
3. **Opções de Prescrição** - Seleção de parâmetros baseados nas recomendações da IA
4. **Plano Completo** - Visualização detalhada dos microciclos e exercícios

### Painel Administrativo
- Dashboard com estatísticas do sistema
- Gerenciamento de Grupos Musculares
- Gerenciamento de Exercícios
- Interface para sincronização de dados

## Stack

- React 19
- Vite (build tool)
- Tailwind CSS
- Lucide React (ícones)


## Configuração de Ambiente

Para conectar com o backend, configure as variáveis de ambiente criando um arquivo `.env` na raiz do projeto:

```env
REACT_APP_API_BASE_URL=http://localhost:8000
REACT_APP_API_TIMEOUT=30000
```

## Build para Produção

Para gerar build otimizado para produção:

```bash
npm run build
```

Os arquivos serão gerados na pasta `build/` e estarão prontos para deploy.

## Padrões de Código

- Use Prettier para formatação automática
- Siga as convenções do ESLint
- Componentes em PascalCase
- Funções em camelCase
- Constantes em UPPER_CASE

## Arquitetura do Sistema

### Estrutura de Componentes
```
App (Context Provider)
├── Header (Navegação)
├── HomePage (Landing)
├── ProfilePage (Criação de perfil - 4 etapas)
├── PrescriptionPage (Opções e geração)
├── FullPrescriptionView (Visualização completa)
└── AdminPage (Painel administrativo)
    ├── AdminDashboard
    ├── MuscleGroupsAdmin
    ├── ExercisesAdmin
    └── HealthConditionsAdmin
```

### Fluxo de Dados
1. Usuário preenche perfil → `ProfilePage`
2. Dados enviados para API → `generatePartialPrescription`
3. IA retorna recomendações → `PrescriptionPage`
4. Usuário seleciona opções → `generateFullPrescription`
5. Sistema gera plano completo → `FullPrescriptionView`
