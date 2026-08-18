import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { rowToClient, patchToRow } from '../lib/mappers';

// Tudo que envolve buscar e gravar dados no Supabase fica isolado aqui.
// Os componentes de tela não sabem que o Supabase existe — só recebem
// `clients` e funções prontas para usar (updateClient, addClient, etc.).
export function useClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

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

  async function updateClient(id, patch) {
    setClients(prev => prev.map(c => c.id === id ? { ...c, ...patch } : c));
    const { error } = await supabase.from('clients').update(patchToRow(patch)).eq('id', id);
    if (error) {
      console.error('Falha ao salvar alteração:', error.message);
      notifyError('Não foi possível salvar essa alteração. Verifique sua conexão e tente novamente.');
    }
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
  };
}
