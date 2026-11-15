// Cliente da API Node/Express (fetch + JSON). Nada de dado pessoal: participantes usam apelido.
const BASE = import.meta.env.VITE_API_URL || '';

async function req(caminho, { method = 'GET', body } = {}) {
  const r = await fetch(BASE + caminho, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) {
    const e = new Error(j.erro || `Erro ${r.status}`);
    e.status = r.status;
    throw e;
  }
  return j;
}

const crud = (base) => ({
  listar: (qs = '') => req(`${base}${qs}`),
  criar: (dados) => req(base, { method: 'POST', body: dados }),
  atualizar: (id, dados) => req(`${base}/${id}`, { method: 'PUT', body: dados }),
  excluir: (id) => req(`${base}/${id}`, { method: 'DELETE' }),
});

export const api = {
  alertaDoDia: () => req('/api/alerta-do-dia'),
  estatisticas: () => req('/api/estatisticas'),
  participantes: crud('/api/participantes'), // CRUD 1
  casos: crud('/api/casos'),                 // CRUD 2
  tentativas: crud('/api/tentativas'),       // CRUD 3 (a lista já vem com o JOIN)
};
export const urlCsv = () => `${BASE}/api/estatisticas.csv`;

// Envia a resposta do simulador para o servidor (que grava no Firestore).
// Se der erro (sem internet, por exemplo), ignora: o treino na tela continua funcionando.
export const enviarTentativa = (participanteId, casoId, respondeuGolpe) =>
  api.tentativas.criar({ participanteId, casoId, respondeuGolpe }).catch(() => {});
