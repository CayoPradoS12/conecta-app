// Gestão da aula (equipe): resultados + os 3 CRUDs (Participantes, Casos, Tentativas/Histórico com JOIN).
import { useCallback, useEffect, useState } from 'react';
import { api, urlCsv } from '../lib/api';
import { IcVoltar } from '../components/Icons';

const CAMPO = 'w-full min-h-[48px] rounded-xl border-2 border-tinta bg-papel px-3 text-base';
const pct = (v) => (v === null || v === undefined ? '—' : `${String(v).replace('.', ',')}%`);
const IDIOMAS = { pt: 'Português', es: 'Español', en: 'English', fr: 'Français', ht: 'Kreyòl' };

/** Carrega uma lista da API e permite recarregar. */
function useLista(buscar) {
  const [lista, setLista] = useState(null);
  const [erro, setErro] = useState('');
  const recarregar = useCallback(() => {
    setErro('');
    buscar().then(setLista).catch((e) => setErro(e.message));
  }, [buscar]);
  useEffect(recarregar, [recarregar]);
  return { lista, erro, recarregar, setErro };
}

const Erro = ({ msg }) => (msg ? <p className="cartao-terra" role="alert">{msg}</p> : null);

// ---------------------------------------------------------------- Resultados
function Resultados() {
  const { lista: dados, erro, recarregar } = useLista(api.estatisticas);
  if (erro) return <div className="cartao-terra space-y-2"><p>{erro}</p><button className="btn-claro" onClick={recarregar}>Tentar de novo</button></div>;
  if (!dados) return <p className="text-lg">Carregando…</p>;
  const comDados = dados.casos.filter((c) => c.tentativas > 0);
  const mais = [...comDados].sort((a, b) => a.taxa_acerto - b.taxa_acerto).slice(0, 3);
  const maxDia = Math.max(1, ...dados.por_dia.map((d) => d.total));
  return (
    <div className="space-y-4">
      <section className="grid grid-cols-2 gap-3">
        <div className="cartao text-center"><p className="font-titulo font-extrabold text-4xl text-tinta">{dados.total_respostas}</p><p>respostas</p></div>
        <div className="cartao-verde text-center"><p className="font-titulo font-extrabold text-4xl text-esmeralda">{pct(dados.taxa_acerto_geral)}</p><p>de acerto</p></div>
      </section>
      {mais.length > 0 && (
        <section className="cartao-terra space-y-1">
          <h2 className="text-lg font-extrabold">Os casos que mais confundem</h2>
          <ol className="list-decimal pl-5 space-y-0.5">{mais.map((c) => <li key={c.caso_id}><b>{c.titulo}</b> · {pct(c.taxa_acerto)} ({c.tentativas})</li>)}</ol>
        </section>
      )}
      <section className="cartao space-y-3">
        <h2 className="text-lg font-extrabold">Acerto por caso</h2>
        {dados.casos.map((c) => (
          <div key={c.caso_id}>
            <div className="flex justify-between gap-2"><span className="font-bold">{c.titulo}</span><span>{pct(c.taxa_acerto)} · {c.tentativas}</span></div>
            <div className="h-3 rounded-full bg-areia overflow-hidden mt-1"><div className="h-full rounded-full" style={{ width: `${c.taxa_acerto ?? 0}%`, background: (c.taxa_acerto ?? 100) < 60 ? '#C85A32' : '#1B7F5A' }} /></div>
          </div>
        ))}
      </section>
      {dados.por_dia.length > 0 && (
        <section className="cartao space-y-2">
          <h2 className="text-lg font-extrabold">Respostas por dia</h2>
          {dados.por_dia.map((d) => (
            <div key={d.dia} className="flex items-center gap-2">
              <span className="w-24 shrink-0">{d.dia.split('-').reverse().join('/')}</span>
              <div className="flex-1 h-4 bg-areia rounded-full overflow-hidden"><div className="h-full bg-tinta" style={{ width: `${(d.total / maxDia) * 100}%` }} /></div>
              <span className="w-8 text-right font-bold">{d.total}</span>
            </div>
          ))}
        </section>
      )}
      <div className="nao-imprimir flex flex-col gap-3">
        <a className="btn-tinta" href={urlCsv()} download>Baixar planilha (CSV)</a>
        <button className="btn-claro" onClick={() => window.print()}>Imprimir / salvar em PDF</button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- CRUD 1: Participantes
function Participantes() {
  const { lista, erro, recarregar, setErro } = useLista(api.participantes.listar);
  const vazio = { apelido: '', idioma: 'pt' };
  const [form, setForm] = useState(vazio);
  const [editando, setEditando] = useState(null);

  const salvar = async (e) => {
    e.preventDefault(); setErro('');
    try {
      if (editando) await api.participantes.atualizar(editando, form); else await api.participantes.criar(form);
      setForm(vazio); setEditando(null); recarregar();
    } catch (err) { setErro(err.message); }
  };
  const excluir = async (p) => {
    if (!window.confirm(`Excluir "${p.apelido}" e todas as respostas dele?`)) return;
    try { await api.participantes.excluir(p.id); recarregar(); } catch (err) { setErro(err.message); }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={salvar} className="cartao space-y-3">
        <h2 className="text-lg font-extrabold">{editando ? 'Editar participante' : 'Novo participante'}</h2>
        <p className="text-sm text-tinta/80">Use só um apelido. Nunca nome real, CPF ou telefone.</p>
        <input className={CAMPO} placeholder="Apelido (ex.: Girassol 7)" value={form.apelido} maxLength={30} required onChange={(e) => setForm({ ...form, apelido: e.target.value })} />
        <select className={CAMPO} value={form.idioma} onChange={(e) => setForm({ ...form, idioma: e.target.value })}>
          {Object.entries(IDIOMAS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <div className="flex gap-2">
          <button className="btn-verde flex-1">{editando ? 'Salvar' : 'Cadastrar'}</button>
          {editando && <button type="button" className="btn-claro" onClick={() => { setEditando(null); setForm(vazio); }}>Cancelar</button>}
        </div>
      </form>
      <Erro msg={erro} />
      {!lista ? <p>Carregando…</p> : lista.length === 0 ? <p className="text-lg">Nenhum participante ainda.</p> : lista.map((p) => (
        <div key={p.id} className="cartao flex items-center gap-2">
          <div className="flex-1"><p className="font-titulo font-extrabold text-tinta">{p.apelido}</p><p className="text-sm">{IDIOMAS[p.idioma]}</p></div>
          <button className="chip" onClick={() => { setEditando(p.id); setForm({ apelido: p.apelido, idioma: p.idioma }); window.scrollTo({ top: 0 }); }}>Editar</button>
          <button className="chip !border-terracota !text-terracota" onClick={() => excluir(p)}>Excluir</button>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------- CRUD 2: Casos
const CASO_VAZIO = { id: '', titulo: '', tema: '', grupo: 'extra', canal: 'WhatsApp', remetente: '', contexto: '', mensagens: '', ehGolpe: 'true', explicacao: '', sinais: '', oQueFazer: '', ordem: 50 };
function Casos({ recarregarCasos }) {
  const { lista, erro, recarregar, setErro } = useLista(api.casos.listar);
  const [form, setForm] = useState(CASO_VAZIO);
  const [editando, setEditando] = useState(null);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const salvar = async (e) => {
    e.preventDefault(); setErro('');
    try {
      if (editando) await api.casos.atualizar(editando, form); else await api.casos.criar(form);
      setForm(CASO_VAZIO); setEditando(null); recarregar(); recarregarCasos();
    } catch (err) { setErro(err.message); }
  };
  const editar = (c) => {
    setEditando(c.id);
    setForm({ ...c, ehGolpe: String(c.ehGolpe), mensagens: c.mensagens.join('\n'), sinais: c.sinais.join('\n'), oQueFazer: c.oQueFazer.join('\n') });
    window.scrollTo({ top: 0 });
  };
  const excluir = async (c) => {
    if (!window.confirm(`Excluir o caso "${c.titulo}" e as respostas dele?`)) return;
    try { await api.casos.excluir(c.id); recarregar(); recarregarCasos(); } catch (err) { setErro(err.message); }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={salvar} className="cartao space-y-3">
        <h2 className="text-lg font-extrabold">{editando ? `Editar caso: ${editando}` : 'Novo caso de golpe'}</h2>
        {!editando && <input className={CAMPO} placeholder="id (ex.: golpe-nubank)" value={form.id} onChange={set('id')} required />}
        <input className={CAMPO} placeholder="Título" value={form.titulo} onChange={set('titulo')} required />
        <div className="grid grid-cols-2 gap-2">
          <input className={CAMPO} placeholder="Tema (Pix, Banco…)" value={form.tema} onChange={set('tema')} />
          <input className={CAMPO} placeholder="Canal (SMS…)" value={form.canal} onChange={set('canal')} />
        </div>
        <input className={CAMPO} placeholder="Remetente" value={form.remetente} onChange={set('remetente')} />
        <input className={CAMPO} placeholder="Contexto (o que a pessoa vê antes)" value={form.contexto} onChange={set('contexto')} />
        <label className="block text-sm font-bold">Mensagens (uma por linha; use [[assim]] nos trechos suspeitos)</label>
        <textarea className={CAMPO} rows={4} value={form.mensagens} onChange={set('mensagens')} required />
        <div className="grid grid-cols-3 gap-2">
          <select className={CAMPO} value={form.ehGolpe} onChange={set('ehGolpe')}><option value="true">É golpe</option><option value="false">É seguro</option></select>
          <select className={CAMPO} value={form.grupo} onChange={set('grupo')}><option value="essencial">Essencial</option><option value="extra">Extra</option></select>
          <input className={CAMPO} type="number" placeholder="Ordem" value={form.ordem} onChange={set('ordem')} />
        </div>
        <label className="block text-sm font-bold">Explicação</label>
        <textarea className={CAMPO} rows={3} value={form.explicacao} onChange={set('explicacao')} required />
        <label className="block text-sm font-bold">Sinais (um por linha)</label>
        <textarea className={CAMPO} rows={3} value={form.sinais} onChange={set('sinais')} />
        <label className="block text-sm font-bold">O que fazer (um por linha)</label>
        <textarea className={CAMPO} rows={3} value={form.oQueFazer} onChange={set('oQueFazer')} />
        <div className="flex gap-2">
          <button className="btn-verde flex-1">{editando ? 'Salvar alterações' : 'Cadastrar caso'}</button>
          {editando && <button type="button" className="btn-claro" onClick={() => { setEditando(null); setForm(CASO_VAZIO); }}>Cancelar</button>}
        </div>
      </form>
      <Erro msg={erro} />
      {!lista ? <p>Carregando…</p> : lista.map((c) => (
        <div key={c.id} className="cartao flex items-center gap-2">
          <div className="flex-1"><p className="text-xs font-bold text-terracota">{c.ordem} · {c.tema} · {c.ehGolpe ? 'golpe' : 'seguro'}</p><p className="font-titulo font-extrabold text-tinta leading-tight">{c.titulo}</p></div>
          <button className="chip" onClick={() => editar(c)}>Editar</button>
          <button className="chip !border-terracota !text-terracota" onClick={() => excluir(c)}>Excluir</button>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------- CRUD 3: Tentativas (JOIN)
function Historico() {
  const { lista, erro, recarregar, setErro } = useLista(api.tentativas.listar);
  const [participantes, setParticipantes] = useState([]);
  const [casos, setCasos] = useState([]);
  const [form, setForm] = useState({ participanteId: '', casoId: '', respondeuGolpe: 'true' });
  useEffect(() => { api.participantes.listar().then(setParticipantes).catch(() => {}); api.casos.listar().then(setCasos).catch(() => {}); }, [lista]);

  const criar = async (e) => {
    e.preventDefault(); setErro('');
    try { await api.tentativas.criar({ ...form, respondeuGolpe: form.respondeuGolpe === 'true' }); recarregar(); } catch (err) { setErro(err.message); }
  };
  const inverter = async (t) => {
    try { await api.tentativas.atualizar(t.id, { respondeuGolpe: !t.respondeuGolpe }); recarregar(); } catch (err) { setErro(err.message); }
  };
  const excluir = async (t) => {
    if (!window.confirm('Excluir esta resposta?')) return;
    try { await api.tentativas.excluir(t.id); recarregar(); } catch (err) { setErro(err.message); }
  };

  return (
    <div className="space-y-4">
      <p className="text-base text-tinta/80">Cada linha junta (JOIN) a tentativa com o apelido do participante e o título do caso.</p>
      <form onSubmit={criar} className="cartao space-y-3">
        <h2 className="text-lg font-extrabold">Registrar resposta</h2>
        <select className={CAMPO} value={form.participanteId} required onChange={(e) => setForm({ ...form, participanteId: e.target.value })}>
          <option value="">Participante…</option>{participantes.map((p) => <option key={p.id} value={p.id}>{p.apelido}</option>)}
        </select>
        <select className={CAMPO} value={form.casoId} required onChange={(e) => setForm({ ...form, casoId: e.target.value })}>
          <option value="">Caso…</option>{casos.map((c) => <option key={c.id} value={c.id}>{c.titulo}</option>)}
        </select>
        <select className={CAMPO} value={form.respondeuGolpe} onChange={(e) => setForm({ ...form, respondeuGolpe: e.target.value })}><option value="true">Respondeu "É golpe"</option><option value="false">Respondeu "É seguro"</option></select>
        <button className="btn-verde w-full">Registrar</button>
      </form>
      <Erro msg={erro} />
      {!lista ? <p>Carregando…</p> : lista.length === 0 ? <p className="text-lg">Nenhuma resposta ainda.</p> : lista.map((t) => (
        <div key={t.id} className="cartao space-y-1">
          <p className="font-titulo font-extrabold text-tinta leading-tight">{t.caso ? t.caso.titulo : '(caso removido)'}</p>
          <p className="text-base">{t.participante ? t.participante.apelido : '(participante removido)'} · {t.dia.split('-').reverse().join('/')}</p>
          <p className="text-base">Respondeu <b>{t.respondeuGolpe ? 'É golpe' : 'É seguro'}</b> · <b className={t.acertou ? 'text-esmeralda' : 'text-terracota'}>{t.acertou ? 'acertou' : 'errou'}</b></p>
          <div className="flex gap-2 pt-1">
            <button className="chip" onClick={() => inverter(t)}>Inverter resposta</button>
            <button className="chip !border-terracota !text-terracota" onClick={() => excluir(t)}>Excluir</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------- Tela
const SECOES = [['resultados', 'Resultados'], ['participantes', 'Participantes'], ['casos', 'Casos'], ['historico', 'Histórico']];

export default function Gestao({ onVoltar, recarregarCasos }) {
  const [sec, setSec] = useState('resultados');
  return (
    <div className="space-y-4 animate-sobe">
      <button onClick={onVoltar} className="nao-imprimir inline-flex items-center gap-1 font-bold text-tinta min-h-[44px]"><IcVoltar width={20} height={20} /> Voltar</button>
      <header>
        <h1 className="text-3xl font-extrabold">Gestão da aula</h1>
        <p className="text-lg mt-1">Área da equipe: resultados e cadastros. Os dados ficam no Firebase Firestore, sem informações pessoais.</p>
      </header>
      <div role="tablist" className="nao-imprimir grid grid-cols-2 gap-2">
        {SECOES.map(([id, nome]) => <button key={id} role="tab" aria-selected={sec === id} aria-pressed={sec === id} className="chip" onClick={() => setSec(id)}>{nome}</button>)}
      </div>
      {sec === 'resultados' && <Resultados />}
      {sec === 'participantes' && <Participantes />}
      {sec === 'casos' && <Casos recarregarCasos={recarregarCasos} />}
      {sec === 'historico' && <Historico />}
    </div>
  );
}
