import { useMemo, useState } from 'react';
import { GLOSSARIO, FRASES, IDIOMAS } from '../data/glossary';
import { verificar } from '../lib/checker';
import AudioButton from '../components/AudioButton';
import { IcBusca, IcCheck, IcAlerta } from '../components/Icons';

const LS = 'cm_idioma';
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

function Segmentos({ valor, onChange }) {
  const itens = [['glossario', 'Glossário'], ['verificador', 'Verificar'], ['frases', 'Frases']];
  return (
    <div role="tablist" aria-label="Seções" className="grid grid-cols-3 gap-2">
      {itens.map(([id, nome]) => (
        <button key={id} role="tab" aria-selected={valor === id} onClick={() => onChange(id)} className="chip" aria-pressed={valor === id}>{nome}</button>
      ))}
    </div>
  );
}

function SeletorIdioma({ idioma, setIdioma }) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Traduzir para">
      {IDIOMAS.map((i) => (
        <button key={i.id} className="chip" aria-pressed={idioma === i.id} onClick={() => setIdioma(i.id)} title={i.rotulo}>{i.nome}</button>
      ))}
    </div>
  );
}

function Glossario({ idioma }) {
  const [busca, setBusca] = useState('');
  const lista = useMemo(() => {
    const q = norm(busca.trim());
    if (!q) return GLOSSARIO;
    return GLOSSARIO.filter((t) => norm(t.pt).includes(q) || norm(t.def).includes(q) || IDIOMAS.some((i) => norm(t[i.id]).includes(q)));
  }, [busca]);

  return (
    <div className="space-y-3">
      <div className="relative">
        <label htmlFor="busca" className="sr-only">Buscar palavra</label>
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-tinta/60"><IcBusca /></span>
        <input id="busca" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar palavra (qualquer idioma)" className="w-full min-h-[56px] rounded-xl border-2 border-tinta bg-folha pl-12 pr-4 text-lg" />
      </div>
      {lista.length === 0 && <p className="text-lg">Nenhuma palavra encontrada.</p>}
      {lista.map((t) => (
        <article key={t.pt} className="cartao space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-terracota">{t.cat}</p>
              <h3 className="text-xl font-extrabold">{t.pt}</h3>
            </div>
            <AudioButton texto={`${t.pt}. ${t.def}`} rotulo="Ouvir" className="shrink-0" />
          </div>
          <p className="text-[1.05rem] leading-snug">{t.def}</p>
          <p className="rounded-xl bg-areia px-3 py-2 text-lg">
            <span className="text-sm font-bold text-tinta/70 block">{IDIOMAS.find((i) => i.id === idioma).nome}</span>
            <span className="font-titulo font-extrabold text-tinta">{t[idioma]}</span>
          </p>
          <details className="text-base">
            <summary className="min-h-[44px] flex items-center font-bold text-tinta cursor-pointer">Ver em todos os idiomas</summary>
            <dl className="mt-1 space-y-1">
              {IDIOMAS.map((i) => (
                <div key={i.id} className="flex gap-2"><dt className="w-32 shrink-0 text-tinta/70">{i.nome}</dt><dd className="font-bold">{t[i.id]}</dd></div>
              ))}
            </dl>
          </details>
        </article>
      ))}
    </div>
  );
}

function Frases({ idioma }) {
  const nome = IDIOMAS.find((i) => i.id === idioma).nome;
  return (
    <div className="space-y-3">
      <p className="text-lg">Frases curtas para usar quando alguém pedir algo estranho. Toque em "Ouvir" e mostre para a pessoa.</p>
      {FRASES.map((f) => (
        <article key={f.pt} className="cartao space-y-2">
          <h3 className="text-xl font-extrabold">{f.pt}</h3>
          <p className="rounded-xl bg-areia px-3 py-2 text-lg"><span className="text-sm font-bold text-tinta/70 block">{nome}</span><span className="font-titulo font-extrabold">{f[idioma]}</span></p>
          <p className="text-base text-tinta/80">{f.def}</p>
          <AudioButton texto={f.pt} rotulo="Ouvir em português" />
        </article>
      ))}
    </div>
  );
}

const NIVEIS = {
  alto: { titulo: 'Muito suspeita', cor: 'text-terracota', classe: 'cartao-terra', texto: 'Não toque em links, não responda e não envie nada. Bloqueie e denuncie.' },
  medio: { titulo: 'Tenha cuidado', cor: 'text-ambar', classe: 'cartao', texto: 'Tem sinais de alerta. Confirme com a pessoa ou empresa por outro caminho (ligando para o número oficial).' },
  baixo: { titulo: 'Poucos sinais encontrados', cor: 'text-esmeralda', classe: 'cartao-verde', texto: 'Não achei sinais fortes, mas isso não é garantia. Se pedir dinheiro, código ou documentos, confirme antes.' },
};

function Verificador() {
  const [texto, setTexto] = useState('');
  const [res, setRes] = useState(null);
  const n = res && NIVEIS[res.nivel];

  return (
    <div className="space-y-3">
      <p className="text-lg">Cole aqui uma mensagem ou um link que você recebeu. A análise é feita no seu celular. <b>O texto não é enviado para ninguém.</b></p>
      <label htmlFor="msg" className="sr-only">Mensagem ou link</label>
      <textarea id="msg" value={texto} onChange={(e) => { setTexto(e.target.value); setRes(null); }} rows={6} placeholder="Cole a mensagem ou o link aqui" className="w-full rounded-xl border-2 border-tinta bg-folha p-3 text-lg" />
      <div className="flex gap-3">
        <button className="btn-tinta flex-1" onClick={() => setRes(verificar(texto))} disabled={!texto.trim()}><IcBusca width={22} height={22} /> Verificar</button>
        <button className="btn-claro" onClick={() => { setTexto(''); setRes(null); }}>Limpar</button>
      </div>

      {n && (
        <section aria-live="polite" className={`${n.classe} space-y-2 animate-sobe`}>
          <p className={`font-titulo font-extrabold text-2xl flex items-center gap-2 ${n.cor}`}>
            {res.nivel === 'baixo' ? <IcCheck width={28} height={28} /> : <IcAlerta width={28} height={28} />} {n.titulo}
          </p>
          {res.motivos.length > 0 && (
            <ul className="list-disc pl-5 space-y-1 text-[1.05rem]">{res.motivos.map((m) => <li key={m}>{m}</li>)}</ul>
          )}
          <p className="text-lg leading-snug">{n.texto}</p>
          <AudioButton texto={`${n.titulo}. ${res.motivos.join(' ')} ${n.texto}`} rotulo="Ouvir o resultado" />
        </section>
      )}
    </div>
  );
}

export default function Tradutor({ secaoInicial }) {
  const [secao, setSecao] = useState(secaoInicial || 'glossario');
  const [idioma, setIdiomaEstado] = useState(() => { try { return localStorage.getItem(LS) || 'es'; } catch { return 'es'; } });
  const setIdioma = (i) => { setIdiomaEstado(i); try { localStorage.setItem(LS, i); } catch { /* ignora */ } };

  return (
    <div className="space-y-4 animate-sobe">
      <header>
        <h1 className="text-3xl font-extrabold">Tradutor e glossário</h1>
        <p className="text-lg mt-1">Palavras de tecnologia em português simples.</p>
      </header>
      <Segmentos valor={secao} onChange={setSecao} />
      {secao !== 'verificador' && <SeletorIdioma idioma={idioma} setIdioma={setIdioma} />}
      {secao === 'glossario' && <Glossario idioma={idioma} />}
      {secao === 'frases' && <Frases idioma={idioma} />}
      {secao === 'verificador' && <Verificador />}
    </div>
  );
}
