import { useEffect, useState } from 'react';
import ALERTAS from '../data/alerts.json';
import { api } from '../lib/api';
import AudioButton from '../components/AudioButton';
import { IcAlerta, IcEscudo, IcChave, IcLivro, IcBusca, IcGrafico, IcSeta } from '../components/Icons';

const alertaLocal = () => ALERTAS[Math.floor(Date.now() / 86400000) % ALERTAS.length];

function saudacao() {
  const h = new Date().getHours();
  return h < 12 ? 'Bom dia!' : h < 18 ? 'Boa tarde!' : 'Boa noite!';
}

function Anel({ feito, total }) {
  const r = 30, c = 2 * Math.PI * r;
  return (
    <svg width="76" height="76" viewBox="0 0 76 76" role="img" aria-label={`${feito} de ${total} casos feitos`}>
      <circle cx="38" cy="38" r={r} fill="none" stroke="#F1ECE3" strokeWidth="9" />
      <circle
        cx="38" cy="38" r={r} fill="none" stroke="#1B7F5A" strokeWidth="9" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c * (1 - feito / total)} transform="rotate(-90 38 38)"
        style={{ transition: 'stroke-dashoffset .6s ease' }}
      />
      <text x="38" y="44" textAnchor="middle" className="font-titulo" fontWeight="800" fontSize="18" fill="#1E3A5F">
        {feito}/{total}
      </text>
    </svg>
  );
}

export default function Inicio({ progresso, ir, abrirGestao, casos }) {
  const [alerta, setAlerta] = useState(alertaLocal);
  useEffect(() => { api.alertaDoDia().then(setAlerta).catch(() => {}); }, []);

  const feitos = Object.keys(progresso).length;
  const acertos = Object.values(progresso).filter(Boolean).length;

  const atalhos = [
    { Icone: IcEscudo, titulo: 'Treinar golpes', sub: 'Simulador', ir: () => ir('simulador') },
    { Icone: IcChave, titulo: 'Testar senha', sub: 'Medidor', ir: () => ir('senhas') },
    { Icone: IcBusca, titulo: 'Verificar mensagem', sub: 'Link ou texto', ir: () => ir('tradutor', { secao: 'verificador' }) },
    { Icone: IcLivro, titulo: 'Palavras', sub: 'Glossário', ir: () => ir('tradutor', { secao: 'glossario' }) },
  ];

  return (
    <div className="space-y-5 animate-sobe">
      <header className="azulejo rounded-2xl border-2 border-tinta shadow-selo p-5 text-papel">
        <p className="text-sm font-bold tracking-wide opacity-90">Olá · Hola · Hello · Bonjour · Bonjou</p>
        <h1 className="!text-papel text-3xl font-extrabold mt-1">{saudacao()}</h1>
        <p className="mt-1 text-lg leading-snug">Vamos aprender a se proteger de golpes no celular. Um passo de cada vez.</p>
      </header>

      <section aria-labelledby="alerta" className="cartao-terra">
        <div className="flex items-center gap-2 text-terracota">
          <IcAlerta />
          <h2 id="alerta" className="!text-terracota text-sm font-extrabold uppercase tracking-wider">Alerta do dia</h2>
        </div>
        <p className="font-titulo font-extrabold text-xl text-tinta mt-1">{alerta.titulo}</p>
        <p className="text-lg mt-1 leading-snug">{alerta.texto}</p>
        <AudioButton texto={`${alerta.titulo}. ${alerta.texto}`} rotulo="Ouvir o alerta" className="mt-3" />
      </section>

      <section aria-labelledby="prog" className="cartao flex items-center gap-4">
        <Anel feito={feitos} total={casos.length} />
        <div className="flex-1">
          <h2 id="prog" className="text-lg font-extrabold">Seu progresso</h2>
          <p className="text-base leading-snug">
            {feitos === 0
              ? 'Você ainda não começou. Faça o primeiro caso!'
              : `Você fez ${feitos} de ${casos.length} casos e acertou ${acertos}.`}
          </p>
          <button onClick={() => ir('simulador')} className="mt-2 font-titulo font-bold text-esmeralda inline-flex items-center gap-1 min-h-[44px]">
            {feitos === 0 ? 'Começar' : 'Continuar'} <IcSeta width={20} height={20} />
          </button>
        </div>
      </section>

      <section aria-label="Atalhos" className="grid grid-cols-2 gap-3">
        {atalhos.map(({ Icone, titulo, sub, ir: vai }) => (
          <button key={titulo} onClick={vai} className="cartao text-left min-h-[110px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-transform">
            <span className="text-esmeralda"><Icone /></span>
            <span className="block font-titulo font-extrabold text-tinta leading-tight mt-2">{titulo}</span>
            <span className="block text-sm text-tinta/70">{sub}</span>
          </button>
        ))}
      </section>

      <footer className="text-sm text-tinta/80 space-y-2 pb-2">
        <p className="cartao !shadow-none !border-tinta/30 !p-3 leading-snug">
          <b>Sua privacidade:</b> este app não pede nome, CPF, telefone nem senha real. Só contamos acertos e erros
          de cada caso, sem saber quem respondeu.
        </p>
        <button onClick={abrirGestao} className="font-bold underline underline-offset-4 min-h-[44px] inline-flex items-center gap-1">
          <IcGrafico width={20} height={20} /> Gestão da aula (para a equipe)
        </button>
        <p className="opacity-80">Conecta+ · UCB · Programa SER+ / IMDH</p>
      </footer>
    </div>
  );
}
