// Converte entre o formato do banco (snake_case) e o formato usado nas telas (camelCase),
// e mapeia colunas de planilhas importadas para o formato da tabela `clients`.

export function rowToClient(r) {
  return {
    id: r.id, empresa: r.empresa, razaoSocial: r.razao_social, nomeFantasia: r.nome_fantasia,
    cnpj: r.cnpj, ie: r.ie, segmento: r.segmento, contato: r.contato, telefone: r.telefone,
    whatsapp: r.whatsapp, email: r.email, endereco: r.endereco, cep: r.cep,
    cidade: r.cidade, estado: r.estado, site: r.site, instagram: r.instagram, linkedin: r.linkedin,
    status: r.status, etapa: r.etapa, vendedor: r.vendedor,
    transportadoraAtual: r.transportadora_atual, concorrentes: r.concorrentes,
    tipoOperacao: r.tipo_operacao, volumeMensal: r.volume_mensal, modal: r.modal,
    necessidade: r.necessidade, dores: r.dores, objecoes: r.objecoes, diferenciais: r.diferenciais,
    valorPotencial: r.valor_potencial, probabilidade: r.probabilidade, proximaAcao: r.proxima_acao,
    timeline: r.timeline || [],
  };
}

// Converte um patch em camelCase (vindo da UI) para snake_case (colunas do Supabase)
const FIELD_TO_COLUMN = {
  empresa: 'empresa', razaoSocial: 'razao_social', nomeFantasia: 'nome_fantasia', cnpj: 'cnpj',
  ie: 'ie', segmento: 'segmento', contato: 'contato', telefone: 'telefone', whatsapp: 'whatsapp',
  email: 'email', endereco: 'endereco', cep: 'cep', cidade: 'cidade', estado: 'estado',
  site: 'site', instagram: 'instagram', linkedin: 'linkedin', status: 'status', etapa: 'etapa',
  vendedor: 'vendedor', transportadoraAtual: 'transportadora_atual', concorrentes: 'concorrentes',
  tipoOperacao: 'tipo_operacao', volumeMensal: 'volume_mensal', modal: 'modal',
  necessidade: 'necessidade', dores: 'dores', objecoes: 'objecoes', diferenciais: 'diferenciais',
  valorPotencial: 'valor_potencial', probabilidade: 'probabilidade', proximaAcao: 'proxima_acao',
  timeline: 'timeline',
};
export function patchToRow(patch) {
  const row = {};
  Object.entries(patch).forEach(([k, v]) => { if (FIELD_TO_COLUMN[k]) row[FIELD_TO_COLUMN[k]] = v; });
  return row;
}

// Converte uma linha da tabela `client_changes` (histórico de alterações) para
// o formato usado nas telas.
export function rowToChange(r) {
  return {
    id: r.id, clientId: r.client_id, empresa: r.empresa, campo: r.campo,
    valorAnterior: r.valor_anterior, valorNovo: r.valor_novo,
    changedBy: r.changed_by, changedAt: r.changed_at,
  };
}

// --- Importação de planilha (Excel/CSV) ---
function normalizeHeader(s) {
  return String(s || '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// Converte uma linha da planilha (objeto com cabeçalhos originais) para uma linha da tabela `clients`.
// Retorna null se a linha não tiver ao menos o nome da empresa.
export function mapImportRow(rawRow) {
  const entries = Object.entries(rawRow).map(([k, v]) => [normalizeHeader(k), v]);
  function find(aliases) {
    for (const [k, v] of entries) {
      if (aliases.includes(k) && String(v).trim() !== '') return v;
    }
    return undefined;
  }
  const empresa = find(['empresa', 'nome', 'nome da empresa', 'nome fantasia', 'razao social']);
  if (!empresa) return null;
  const telefone = find(['telefone', 'celular', 'whatsapp', 'fone']);
  return {
    empresa: String(empresa).trim(),
    razao_social: String(find(['razao social']) || empresa).trim(),
    nome_fantasia: String(empresa).trim(),
    cnpj: String(find(['cnpj']) || '').trim(),
    segmento: String(find(['segmento']) || '').trim(),
    contato: String(find(['contato', 'nome do contato']) || '').trim(),
    telefone: String(telefone || '').trim(),
    whatsapp: String(find(['whatsapp']) || telefone || '').trim(),
    email: String(find(['email', 'e-mail']) || '').trim(),
    cidade: String(find(['cidade']) || '').trim(),
    estado: String(find(['estado', 'uf']) || '').trim(),
    vendedor: String(find(['vendedor', 'responsavel']) || '').trim(),
    status: String(find(['status']) || 'Prospect').trim() || 'Prospect',
    etapa: String(find(['etapa']) || 'Lead').trim() || 'Lead',
    modal: 'Rodoviário',
    valor_potencial: Number(find(['valor potencial', 'valor'])) || 0,
    probabilidade: 30,
    proxima_acao: String(find(['proxima acao', 'proximo passo']) || '').trim(),
    timeline: [],
  };
}
