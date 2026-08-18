import * as XLSX from 'xlsx';

export function exportClientsToExcel(clients) {
  const resumo = clients.map(c => ({
    Empresa: c.empresa, 'Razão Social': c.razaoSocial, CNPJ: c.cnpj, Segmento: c.segmento,
    Contato: c.contato, Telefone: c.telefone, Email: c.email, Cidade: c.cidade, Estado: c.estado,
    Vendedor: c.vendedor, Status: c.status, Etapa: c.etapa,
    'Probabilidade (%)': c.probabilidade, 'Valor Potencial': c.valorPotencial,
    'Próxima Ação': c.proximaAcao, 'Nº de Interações': c.timeline.length,
    'Último Contato': [...c.timeline].map(t => t.data).filter(Boolean).sort().slice(-1)[0] || '',
  }));

  const interacoes = [];
  clients.forEach(c => {
    c.timeline.forEach(t => {
      interacoes.push({ Empresa: c.empresa, Data: t.data, Nota: t.nota });
    });
  });

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(resumo), 'Clientes');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(interacoes), 'Interações');
  const hoje = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `rota-crm-relatorio-${hoje}.xlsx`);
}
