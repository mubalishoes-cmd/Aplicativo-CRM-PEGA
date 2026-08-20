// Tokens de design do Rota CRM: cores, espaçamento, raio de borda e tipografia
// usados em todo o app. Hoje esses valores estão espalhados como hex soltos em
// cada componente (Dashboard.jsx, Funil.jsx, ClienteLista.jsx, ClienteDetalhe.jsx,
// App.jsx...) — este arquivo reúne os mesmos valores num só lugar para que,
// daqui pra frente, novas telas (e a migração das telas existentes) usem essas
// constantes em vez de repetir hex codes.
//
// Este arquivo só ADICIONA os tokens — nenhum componente foi alterado para
// usá-los ainda, então criar este arquivo não muda nada visualmente no app.
// A migração dos componentes é o próximo passo, feita aos poucos.

export const colors = {
  // Marca
  brandNavy: '#101828',      // cor de texto principal, fundo da sidebar, botões primários
  brandOrange: '#F5A524',    // laranja da marca (logo, destaques, CTA)
  brandOrangeDark: '#E8871E',// usado no gradiente do logo junto com brandOrange

  // Texto
  textPrimary: '#101828',
  textSecondary: '#5B6472',
  textMuted: '#8C93A6',
  textOnDark: '#fff',
  textOnDarkMuted: '#A6ADBB',

  // Semânticas (status, alertas)
  success: '#1C7C54',   // Ativo
  info: '#2E5EAA',      // Prospect / links / foco
  warning: '#F5A524',   // Cotação em aberto / Recuperado
  danger: '#B0463C',    // Perdido / erros
  successBg: '#EAF6EF',
  dangerBg: '#FBEAE8',

  // Neutros / superfícies
  bgPage: '#F5F6F8',
  bgSurface: '#fff',
  bgSubtle: '#F0F1F3',      // fundo das colunas do Kanban
  border: '#E5E7EB',        // inputs, selects
  borderCard: '#ECEDF0',    // bordas de cards
  scrollbarThumb: '#D3D7DE',
  emptyStateText: '#B4B9C2',

  // Sidebar (fundo escuro)
  sidebarBg: '#101828',
  sidebarActiveBg: '#1E293B',
  sidebarBorder: '#1F2937',
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
  display: "'Space Grotesk', sans-serif", // títulos
  body: "'Inter', system-ui, sans-serif", // texto padrão
  mono: "'JetBrains Mono', monospace",    // códigos de etapa, valores técnicos
};

export const shadow = {
  cardHover: '0 8px 20px rgba(16,24,40,0.08)',
  cardSubtle: '0 1px 2px rgba(16,24,40,0.04)',
};

// As cores por etapa do funil (STAGES) e por status (STATUS_COLOR) já vivem
// centralizadas em src/lib/constants.js — não foram duplicadas aqui de propósito.
// Quando os componentes migrarem para usar este arquivo, constants.js pode
// passar a importar as cores base a partir daqui.
