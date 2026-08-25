import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { rowToClient, patchToRow, rowToChange } from '../lib/mappers';

// Tudo que envolve buscar e gravar dados no Supabase fica isolado aqui.
// Os componentes de tela não sabem que o Supabase existe — só recebem
// `clients` e funções prontas para usar (updateClient, addClient, etc.).
//
// `userEmail` (opcional) é gravado em `changed_by` no histórico de alterações,
// para saber quem fez cada mudança de etapa/status.
export function useClients(userEmail) {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [changes, setChanges] = useState([]);
  const [undoing, setUndoing] = useState(false);

  function notifyError(msg) {
    setErrorMsg(msg);
    window.clearTimeout(notifyError._t);
    notifyError._t = window.setTimeout(() => setErrorMsg(null), 6000);
  }

  useEffect(() => {
    let active = true;
    supabase.from('clients').select('*').order('id').then(({ data, error }) => {
      if (!active) return;
      if (!error && data) setClients(data.map(rowToClient));
      setLoading(false);
    });

    // Mantém os dois logins sincronizados em tempo real.
    const channel = supabase.channel('clients-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'clients' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setClients(prev => prev.some(c => c.id === payload.new.id) ? prev : [...prev, rowToClient(payload.new)]);
        } else if (payload.eventType === 'UPDATE') {
          setClients(prev => prev.map(c => c.id === payload.new.id ? rowToClient(payload.new) : c));
        } else if (payload.eventType === 'DELETE') {
          setClients(prev => prev.filter(c => c.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => { active = false; supabase.removeChannel(channel); };
  }, []);

  // Histórico de alterações (etapa/status) — usado pela tela "Histórico" e
  // pelo botão "Desfazer". Carregado uma vez ao abrir o app; cada alteração
  // feita a partir desta aba entra na lista na hora (sem precisar recarregar).
  useEffect(() => {
    let active = true;
    supabase.from('client_changes').select('*').order('changed_at', { ascending: false }).limit(200)
      .then(({ data, error }) => {
        if (!active) return;
        if (!error && data) setChanges(data.map(rowToChange));
      });
    return () => { active = false; };
  }, []);

  // Registra uma alteração de etapa ou status no histórico. Silencioso em
  // caso de erro (o histórico é um complemento — não deve travar a edição
  // principal se falhar ao gravar o log).
  async function logChange(client, campo, valorAnterior, valorNovo) {
    if (valorAnterior === valorNovo) return;
    const row = {
      client_id: client.id, empresa: client.empresa, campo,
      valor_anterior: valorAnterior ?? null, valor_novo: valorNovo ?? null,
      changed_by: userEmail || null,
    };
    const { data, error } = await supabase.from('client_changes').insert(row).select().single();
    if (error) {
      console.error('Falha ao registrar no histórico:', error.message);
      return;
    }
    if (data) setChanges(prev => [rowToChange(data), ...prev]);
  }

  async function updateClient(id, patch) {
    const before = clients.find(c => c.id === id);
    setClients(prev => prev.map(c => c.id === id ? { ...c, ...patch } : c));
    const { error } = await supabase.from('clients').update(patchToRow(patch)).eq('id', id);
    if (error) {
      console.error('Falha ao salvar alteração:', error.message);
      notifyError('Não foi possível salvar essa alteração. Verifique sua conexão e tente novamente.');
      return;
    }
    if (before) {
      if ('etapa' in patch && patch.etapa !== before.etapa) await logChange(before, 'etapa', before.etapa, patch.etapa);
      if ('status' in patch && patch.status !== before.status) await logChange(before, 'status', before.status, patch.status);
    }
  }

  // Reverte a alteração mais recente do histórico (a que está no topo da
  // lista, `changes[0]`). É global — desfaz a última mudança de qualquer
  // usuário, não só as feitas nesta aba —, o que faz sentido num CRM de uso
  // conjunto. Reaproveita updateClient, então o próprio "desfazer" também
  // gera uma nova entrada no histórico (nada é apagado, só compensado).
  async function undoLastChange() {
    if (!changes.length || undoing) return;
    const last = changes[0];
    const client = clients.find(c => c.id === last.clientId);
    if (!client) {
      notifyError('Não foi possível desfazer: esse cadastro não existe mais.');
      return;
    }
    setUndoing(true);
    await updateClient(last.clientId, { [last.campo]: last.valorAnterior });
    setUndoing(false);
  }

  async function addTimelineEntry(id, nota) {
    if (!nota.trim()) return;
    const today = new Date().toISOString().slice(0, 10);
    const client = clients.find(c => c.id === id);
    const novaTimeline = [...(client?.timeline || []), { data: today, nota }];
    setClients(prev => prev.map(c => c.id === id ? { ...c, timeline: novaTimeline } : c));
    const { error } = await supabase.from('clients').update({ timeline: novaTimeline }).eq('id', id);
    if (error) {
      console.error('Falha ao salvar interação:', error.message);
      notifyError('Não foi possível salvar essa anotação. Verifique sua conexão e tente novamente.');
    }
  }

  async function addClient(empresa) {
    if (!empresa.trim()) return;
    const row = {
      empresa, razao_social: empresa, nome_fantasia: empresa, status: 'Prospect',
      etapa: 'Lead', modal: 'Rodoviário', probabilidade: 30, valor_potencial: 0, timeline: [],
    };
    const { data, error } = await supabase.from('clients').insert(row).select().single();
    if (error) {
      console.error('Falha ao criar empresa:', error.message);
      notifyError('Não foi possível cadastrar essa empresa. Verifique sua conexão e tente novamente.');
      return;
    }
    setClients(prev => prev.some(c => c.id === data.id) ? prev : [...prev, rowToClient(data)]);
    return data.id;
  }

  // Insere várias linhas de uma vez (usado na importação de planilha). Retorna { inserted, error }.
  async function importClients(rows) {
    if (!rows.length) return { inserted: 0, error: null };
    const { data, error } = await supabase.from('clients').insert(rows).select();
    if (error) {
      console.error('Falha ao importar planilha:', error.message);
      return { inserted: 0, error };
    }
    setClients(prev => [...prev, ...data.map(rowToClient)]);
    return { inserted: data.length, error: null };
  }

  async function deleteClient(id) {
    const anterior = clients;
    setClients(prev => prev.filter(c => c.id !== id));
    const { error } = await supabase.from('clients').delete().eq('id', id);
    if (error) {
      console.error('Falha ao excluir:', error.message);
      notifyError('Não foi possível excluir esse cadastro. Verifique sua conexão e tente novamente.');
      setClients(anterior);
      return false;
    }
    return true;
  }

  return {
    clients, loading, errorMsg,
    clearError: () => setErrorMsg(null),
    updateClient, addTimelineEntry, addClient, importClients, deleteClient,
    changes, undoing, undoLastChange,
  };
}
