# Sistema de Prescrição Inteligente de Treinos - Frontend

Repositório referente ao projeto final da cadeira de Programação Web 1

## Integrantes

- Mikael Brasileiro Ferreira de Almeida Amaral
- Lucas Oliveira Carvalho
- Cristian Alves da Silva
  
## Funcionalidades

- **Análise Inteligente de Perfil**: Interface para coleta de dados pessoais, experiência e condições de saúde
- **Prescrições Personalizadas**: Geração de planos de treino adaptados ao usuário
- **Painel Administrativo**: Gerenciamento de metadados (grupos musculares, exercícios, condições de saúde)
- **Design Responsivo**: Interface otimizada para desktop e mobile
- **Integração com API**: Preparado para conectar com backend FastAPI

## Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- Git

## Instalação
1. **Clone o repositório**
   ```bash
   git clone https://github.com/Mikaelbfaa/Projeto-PWeb.git
   cd Projeto-PWeb
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure o Tailwind CSS**
   ```bash
   npm install -D tailwindcss@^3.4.0 postcss autoprefixer
   npx tailwindcss init -p
   ```

## Executar o Projeto

```bash
npm start
```

O aplicativo estará disponível em `http://localhost:3000`

## Scripts Disponíveis

- `npm start` - Executa o app em modo de desenvolvimento
- `npm test` - Executa os testes
- `npm run build` - Gera build de produção
- `npm run eject` - Remove as abstrações do Create React App (irreversível)

## Estrutura do Projeto

```
src/
├── App.js          # Componente principal com todas as funcionalidades
├── index.js        # Ponto de entrada da aplicação
└── index.css       # Estilos globais com Tailwind CSS
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

## Tecnologias Utilizadas

- **React 18+** - Framework frontend
- **Tailwind CSS** - Framework de estilos utilitários
- **Lucide React** - Biblioteca de ícones
- **Context API** - Gerenciamento de estado global


## Configuração de Ambiente

Para conectar com o backend, configure as variáveis de ambiente criando um arquivo `.env` na raiz do projeto:

```env
REACT_APP_API_BASE_URL=http://localhost:8000
REACT_APP_API_TIMEOUT=30000
```

## Solução de Problemas

### Erro: 'react-scripts' não é reconhecido
```bash
npm install react-scripts@5.0.1
```

### Erro: Module not found 'reportWebVitals'
Remova as importações desnecessárias do `src/index.js` conforme mostrado na seção de instalação.

### Aviso: Unknown at rule @tailwind
Instale a extensão "Tailwind CSS IntelliSense" no VS Code ou ignore o aviso (não afeta o funcionamento).

### Problemas de CORS
Se houver erro de CORS ao conectar com a API, configure o backend FastAPI para permitir requisições do frontend:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Testes

Para executar os testes:

```bash
npm test
```

Para executar todos os testes uma única vez:

```bash
npm test -- --coverage --watchAll=false
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

## Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

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
