// Tokens de design do Rota CRM: cores, espaçamento, raio de borda e tipografia
// usados em todo o app. Como todos os componentes já importam essas constantes
// em vez de repetir hex codes, trocar um valor aqui atualiza o app inteiro.
//
// Paleta alinhada à identidade visual da Pega Entrega (pegaentrega.com.br):
// vermelho como cor de marca/ação, cinza-chumbo no lugar do azul-marinho nas
// áreas escuras, tipografia Manrope. As cores semânticas de status (verde/azul/
// laranja/vermelho-perdido) foram mantidas de propósito — são convenções de
// leitura (sucesso/alerta/erro) e não fazem parte da identidade da marca.

export const colors = {
  // Marca
  brandNavy: '#212121',      // cor de texto principal, fundo de telas de login/config, botões primários
  brandOrange: '#E4001B',    // vermelho da marca (logo, destaques, CTA) — nome do token mantido para não quebrar imports
  brandOrangeDark: '#C60018',// usado no gradiente do logo e em botões, junto com brandOrange

  // Texto
  textPrimary: '#212121',
  textSecondary: '#5C5C5C',
  textMuted: '#8C8C8C',
  textOnDark: '#fff',
  textOnDarkMuted: '#BFBFBF',

  // Semânticas (status, alertas) — mantidas: convenção de leitura, não identidade de marca
  success: '#1C7C54',   // Ativo
  info: '#2E5EAA',      // Prospect / links / foco
  warning: '#F5A524',   // Cotação em aberto / Recuperado
  danger: '#B0463C',    // Perdido / erros
  successBg: '#EAF6EF',
  dangerBg: '#FBEAE8',

  // Neutros / superfícies
  bgPage: '#F7F6F5',
  bgSurface: '#fff',
  bgSubtle: '#F1F0EF',      // fundo das colunas do Kanban
  border: '#E6E4E2',        // inputs, selects
  borderCard: '#ECEAE8',    // bordas de cards
  scrollbarThumb: '#D6D3D0',
  emptyStateText: '#B8B5B2',

  // Sidebar (fundo escuro)
  sidebarBg: '#2B2A2A',
  sidebarActiveBg: '#3D3B3B',
  sidebarBorder: '#403E3E',
};

// Escala de espaçamento (px). Cobre os valores já usados no app — ao criar
// telas novas, prefira um destes em vez de um número solto.
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
};

// Raio de borda. O app hoje mistura 7/8/9/12/14 — os dois abaixo cobrem a
// grande maioria dos casos (inputs/botões vs. cards/modais).
export const radius = {
  sm: 8,
  lg: 12,
};

// Escala tipográfica. O app hoje tem ~15 tamanhos diferentes (10 a 28px);
// esta escala reduz para 7 passos que cobrem os mesmos usos.
export const fontSize = {
  xs: 11,     // labels em maiúsculo, legendas de gráfico
  sm: 12.5,   // texto secundário, botões
  base: 13.5, // texto padrão de formulário/corpo
  md: 15,     // títulos de card ("Funil Comercial", "Ficha da Empresa")
  lg: 16,     // títulos de tela secundários
  xl: 22,     // títulos de página ("Painel Comercial", "Clientes")
  xxl: 28,    // números grandes dos KPIs
};

export const fontFamily = {
  display: "'Manrope', sans-serif",       // títulos
  body: "'Manrope', system-ui, sans-serif", // texto padrão
  mono: "'JetBrains Mono', monospace",    // códigos de etapa, valores técnicos
};

export const shadow = {
  cardHover: '0 8px 20px rgba(20,18,18,0.08)',
  cardSubtle: '0 1px 2px rgba(20,18,18,0.04)',
};

// As cores por etapa do funil (STAGES) e por status (STATUS_COLOR) já vivem
// centralizadas em src/lib/constants.js — não foram duplicadas aqui de propósito.
// Quando os componentes migrarem para usar este arquivo, constants.js pode
// passar a importar as cores base a partir daqui.
