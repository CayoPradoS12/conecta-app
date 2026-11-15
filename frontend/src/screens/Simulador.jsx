import { useState } from 'react';
import { textoParaAudio, explicacaoParaAudio } from '../data/cases';
import Balao from '../components/Balao';
import AudioButton from '../components/AudioButton';
import { IcCheck, IcX, IcSeta, IcVoltar, IcRecomecar } from '../components/Icons';
import { enviarTentativa } from '../lib/api';
import { getVelocidade, setVelocidade, parar } from '../lib/speech';

function Status({ valor }) {
  if (valor === undefined) return <span className="selo border-tinta/40 text-tinta/70">Novo</span>;
  return valor ? (
    <span className="selo border-esmeralda text-esmeralda"><IcCheck width={16} height={16} /> Acertou</span>
  ) : (
    <span className="selo border-terracota text-terracota">Rever</span>
  );
}

function Lista({ titulo, casos, todos, progresso, abrir }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-extrabold">{titulo}</h2>
      {casos.map((c) => (
        <button key={c.id} onClick={() => abrir(todos.indexOf(c))} className="cartao w-full text-left flex items-center gap-3 min-h-[72px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-transform">
          <span className="flex-1">
            <span className="block text-sm font-bold text-terracota">{c.tema}</span>
            <span className="block font-titulo font-extrabold text-tinta leading-tight">{c.titulo}</span>
          </span>
          <Status valor={progresso[c.id]} />
        </button>
      ))}
    </section>
  );
}

function EscolherApelido({ criar }) {
  const [apelido, setApelido] = useState('');
  const [idioma, setIdioma] = useState('pt');
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);
  const enviar = async (e) => {
    e.preventDefault(); setErro(''); setSalvando(true);
    try { await criar(apelido, idioma); } catch (err) { setErro(err.message); } finally { setSalvando(false); }
  };
  return (
    <form onSubmit={enviar} className="space-y-4 animate-sobe">
      <header>
        <h1 className="text-3xl font-extrabold">Escolha um apelido</h1>
        <p className="text-lg mt-1">Para guardar seus resultados sem saber quem você é. <b>Não use seu nome real, telefone nem CPF.</b> Exemplo: Girassol 7.</p>
      </header>
      <label className="block font-bold" htmlFor="ap">Apelido</label>
      <input id="ap" value={apelido} onChange={(e) => setApelido(e.target.value)} maxLength={30} required autoComplete="off" className="w-full min-h-[56px] rounded-xl border-2 border-tinta bg-folha px-4 text-lg" />
      <label className="block font-bold" htmlFor="id">Seu idioma</label>
      <select id="id" value={idioma} onChange={(e) => setIdioma(e.target.value)} className="w-full min-h-[56px] rounded-xl border-2 border-tinta bg-folha px-4 text-lg">
        <option value="pt">Português</option><option value="es">Español</option><option value="en">English</option><option value="fr">Français</option><option value="ht">Kreyòl ayisyen</option>
      </select>
      {erro && <p className="cartao-terra" role="alert">{erro}</p>}
      <button className="btn-verde w-full" disabled={salvando}>{salvando ? 'Salvando…' : 'Começar a treinar'}</button>
    </form>
  );
}

export default function Simulador({ casos: CASOS, participante, criarParticipante, sairParticipante, progresso, registrar, limpar }) {
  const ESSENCIAIS = CASOS.filter((c) => c.grupo === 'essencial');
  const EXTRAS = CASOS.filter((c) => c.grupo !== 'essencial');
  const [idx, setIdx] = useState(null);
  const [resposta, setResposta] = useState(null); // true = "é golpe", false = "é seguro"
  const [resumo, setResumo] = useState(false);
  const [devagar, setDevagar] = useState(() => getVelocidade() < 0.85);

  const abrir = (i) => { parar(); setIdx(i); setResposta(null); setResumo(false); window.scrollTo({ top: 0 }); };
  const fechar = () => { parar(); setIdx(null); setResumo(false); };
  const alternarVoz = () => { const d = !devagar; setDevagar(d); setVelocidade(d ? 0.7 : 0.9); };

  const responder = (diz) => {
    const caso = CASOS[idx];
    const acertou = diz === caso.ehGolpe;
    setResposta(diz);
    registrar(caso.id, acertou);
    enviarTentativa(participante.id, caso.id, diz); // o servidor confere e calcula o acerto
  };

  const proximo = () => (idx + 1 < CASOS.length ? abrir(idx + 1) : (parar(), setResumo(true), setIdx(null)));

  if (!participante) return <EscolherApelido criar={criarParticipante} />;

  // ---------- Resumo ----------
  if (resumo) {
    const acertos = Object.values(progresso).filter(Boolean).length;
    const revisar = CASOS.filter((c) => progresso[c.id] === false);
    return (
      <div className="space-y-4 animate-sobe">
        <h1 className="text-3xl font-extrabold">Muito bem!</h1>
        <div className="cartao-verde text-center">
          <p className="font-titulo font-extrabold text-5xl text-esmeralda">{acertos}/{CASOS.length}</p>
          <p className="text-lg mt-1">casos corretos</p>
        </div>
        {revisar.length > 0 ? (
          <div className="cartao">
            <h2 className="text-lg font-extrabold">Vamos rever estes:</h2>
            <ul className="mt-2 space-y-1">
              {revisar.map((c) => (
                <li key={c.id}>
                  <button className="underline underline-offset-4 font-bold text-tinta min-h-[44px]" onClick={() => abrir(CASOS.indexOf(c))}>{c.titulo}</button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-lg">Você acertou tudo. Conte para um amigo o que aprendeu!</p>
        )}
        <div className="flex flex-col gap-3">
          <button className="btn-tinta" onClick={fechar}>Ver todos os casos</button>
          <button className="btn-claro" onClick={() => { limpar(); fechar(); }}><IcRecomecar width={20} height={20} /> Treinar de novo</button>
        </div>
      </div>
    );
  }

  // ---------- Lista ----------
  if (idx === null) {
    const feitos = Object.keys(progresso).length;
    const proxIdx = CASOS.findIndex((c) => progresso[c.id] === undefined);
    return (
      <div className="space-y-5 animate-sobe">
        <header>
          <h1 className="text-3xl font-extrabold">Simulador de golpes</h1>
          <p className="text-lg mt-1">Leia a mensagem. Decida: <b>é golpe</b> ou <b>é seguro</b>? Depois veja a explicação.</p>
        </header>
        <div className="flex items-center justify-between gap-3">
          <button className="btn-verde flex-1" onClick={() => abrir(proxIdx === -1 ? 0 : proxIdx)}>
            {feitos === 0 ? 'Começar' : proxIdx === -1 ? 'Ver de novo' : 'Continuar'} <IcSeta width={22} height={22} />
          </button>
          <button className="chip" aria-pressed={devagar} onClick={alternarVoz}>Voz devagar</button>
        </div>
        <p className="text-base text-tinta/80">Você é <b>{participante.apelido}</b>. <button className="underline underline-offset-4 font-bold min-h-[44px]" onClick={() => { limpar(); sairParticipante(); }}>Trocar apelido</button></p>
        <Lista titulo={`${ESSENCIAIS.length} casos essenciais`} casos={ESSENCIAIS} todos={CASOS} progresso={progresso} abrir={abrir} />
        <Lista titulo="Documentos, WhatsApp e mais" casos={EXTRAS} todos={CASOS} progresso={progresso} abrir={abrir} />
        {feitos === CASOS.length && (
          <button className="btn-claro w-full" onClick={() => setResumo(true)}>Ver minha pontuação</button>
        )}
      </div>
    );
  }

  // ---------- Caso ----------
  const caso = CASOS[idx];
  const respondeu = resposta !== null;
  const acertou = respondeu && resposta === caso.ehGolpe;

  return (
    <div className="space-y-4 animate-sobe" key={caso.id}>
      <div className="flex items-center justify-between">
        <button onClick={fechar} className="inline-flex items-center gap-1 font-bold text-tinta min-h-[44px]"><IcVoltar width={20} height={20} /> Casos</button>
        <span className="selo border-tinta text-tinta">Caso {idx + 1} de {CASOS.length}</span>
      </div>

      <div>
        <p className="text-sm font-bold text-terracota">{caso.tema}</p>
        <h1 className="text-2xl font-extrabold leading-tight">{caso.titulo}</h1>
        <p className="text-lg mt-1 text-tinta/80">{caso.contexto}</p>
      </div>

      <Balao caso={caso} revelar={respondeu} />
      <AudioButton texto={textoParaAudio(caso)} rotulo="Ouvir a mensagem" />

      {!respondeu ? (
        <div className="space-y-3 pt-1">
          <p className="font-titulo font-extrabold text-xl text-tinta">O que você acha?</p>
          <button className="btn-terra w-full !min-h-[60px] text-lg" onClick={() => responder(true)}>É golpe</button>
          <button className="btn-verde w-full !min-h-[60px] text-lg" onClick={() => responder(false)}>É seguro</button>
        </div>
      ) : (
        <section aria-live="polite" className={`${acertou ? 'cartao-verde' : 'cartao-terra'} space-y-3 animate-sobe`}>
          <p className={`font-titulo font-extrabold text-2xl flex items-center gap-2 ${acertou ? 'text-esmeralda' : 'text-terracota'}`}>
            {acertou ? <IcCheck width={30} height={30} /> : <IcX width={30} height={30} />}
            {acertou ? 'Isso mesmo!' : 'Quase! Veja os sinais.'}
          </p>
          <p className="text-lg leading-snug">{caso.explicacao}</p>

          <div>
            <h2 className="text-base font-extrabold">{caso.ehGolpe ? 'Sinais de golpe' : 'Por que parece seguro'}</h2>
            <ul className="mt-1 space-y-1 list-disc pl-5 text-[1.05rem]">{caso.sinais.map((s) => <li key={s}>{s}</li>)}</ul>
          </div>
          <div>
            <h2 className="text-base font-extrabold">O que fazer</h2>
            <ol className="mt-1 space-y-1 list-decimal pl-5 text-[1.05rem]">{caso.oQueFazer.map((s) => <li key={s}>{s}</li>)}</ol>
          </div>

          <AudioButton texto={explicacaoParaAudio(caso)} rotulo="Ouvir a explicação" />
          <button className="btn-tinta w-full" onClick={proximo}>
            {idx + 1 < CASOS.length ? 'Próximo caso' : 'Ver minha pontuação'} <IcSeta width={22} height={22} />
          </button>
        </section>
      )}
    </div>
  );
}
