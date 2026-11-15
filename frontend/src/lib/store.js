import { useCallback, useState } from 'react';

const CHAVE = 'cm_progresso';

function ler() {
  try { return JSON.parse(localStorage.getItem(CHAVE)) || {}; } catch { return {}; }
}

/** Progresso fica só neste aparelho: { casoId: acertou(boolean) }. Sem dados pessoais. */
export function useProgresso() {
  const [progresso, setProgresso] = useState(ler);

  const registrar = useCallback((id, acertou) => {
    setProgresso((p) => {
      const novo = { ...p, [id]: acertou };
      try { localStorage.setItem(CHAVE, JSON.stringify(novo)); } catch { /* ignora */ }
      return novo;
    });
  }, []);

  const limpar = useCallback(() => {
    try { localStorage.removeItem(CHAVE); } catch { /* ignora */ }
    setProgresso({});
  }, []);

  return { progresso, registrar, limpar };
}
