import { useCallback, useEffect, useState } from 'react';
import { api } from './api';
import { CASOS as CASOS_LOCAIS } from '../data/cases';

const lerJson = (k, padrao) => { try { return JSON.parse(localStorage.getItem(k)) ?? padrao; } catch { return padrao; } };
const gravar = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignora */ } };

/** Casos vindos do Firestore (CRUD de casos). Sem internet, usa a cópia guardada ou a embutida. */
export function useCasos() {
  const [casos, setCasos] = useState(() => lerJson('cm_casos', CASOS_LOCAIS));
  const recarregar = useCallback(() => {
    api.casos.listar().then((l) => { if (l.length) { setCasos(l); gravar('cm_casos', l); } }).catch(() => {});
  }, []);
  useEffect(recarregar, [recarregar]);
  return { casos, recarregar };
}

/** Participante anônimo (só apelido), guardado neste aparelho e no Firestore. */
export function useParticipante() {
  const [participante, setP] = useState(() => lerJson('cm_participante', null));
  const criar = async (apelido, idioma) => {
    const p = await api.participantes.criar({ apelido, idioma });
    const dados = { id: p.id, apelido: p.apelido };
    gravar('cm_participante', dados);
    setP(dados);
  };
  const sair = () => { try { localStorage.removeItem('cm_participante'); } catch { /* ignora */ } setP(null); };
  return { participante, criar, sair };
}
