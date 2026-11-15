import { useState } from 'react';
import { avaliar } from '../lib/password';
import { IcCheck, IcOlho, IcOlhoFechado } from '../components/Icons';
import AudioButton from '../components/AudioButton';

const CORES = ['#C85A32', '#C85A32', '#B7791F', '#1B7F5A', '#1B7F5A'];

const WHATS = [
  'Ativar a verificação em duas etapas (Configurações > Conta).',
  'Nunca passar o código de 6 números, nem para amigos.',
  'Grupos: só "Meus contatos" podem me adicionar (Configurações > Privacidade > Grupos).',
  'Desconfiar de quem pede Pix, mesmo conhecido. Ligar antes.',
  'Não tocar em links de números desconhecidos.',
  'Bloquear e denunciar quem tentar golpe.',
];

const BOAS = [
  'Use uma frase com 4 palavras e traços. É longa e fácil de lembrar.',
  'Uma senha diferente para cada serviço (banco, e-mail, WhatsApp).',
  'Nunca conte sua senha, nem para o banco, nem para amigos.',
  'Não use nome, data de nascimento ou telefone.',
];

export default function Senhas() {
  const [pw, setPw] = useState('');
  const [ver, setVer] = useState(false);
  const [marcados, setMarcados] = useState({});
  const r = avaliar(pw); // tudo local: a senha nunca é salva nem enviada

  const marcar = (i) => setMarcados((m) => ({ ...m, [i]: !m[i] }));

  return (
    <div className="space-y-5 animate-sobe">
      <header>
        <h1 className="text-3xl font-extrabold">Senhas fortes</h1>
        <p className="text-lg mt-1">Teste como uma senha é forte. <b>Não digite sua senha verdadeira.</b> Invente uma para treinar.</p>
      </header>

      <section className="cartao space-y-3" aria-labelledby="medidor">
        <h2 id="medidor" className="text-lg font-extrabold">Medidor</h2>
        <div className="relative">
          <label htmlFor="pw" className="sr-only">Senha de teste</label>
          <input
            id="pw"
            type={ver ? 'text' : 'password'}
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
            name="treino-nao-e-senha-real"
            placeholder="Digite uma senha de treino"
            className="w-full min-h-[56px] rounded-xl border-2 border-tinta bg-papel px-4 pr-14 text-lg font-bold"
          />
          <button type="button" onClick={() => setVer(!ver)} aria-label={ver ? 'Esconder' : 'Mostrar'} className="absolute right-1 top-1 min-h-[48px] min-w-[48px] flex items-center justify-center text-tinta">
            {ver ? <IcOlhoFechado /> : <IcOlho />}
          </button>
        </div>

        <div className="flex gap-1.5" role="meter" aria-valuemin={0} aria-valuemax={4} aria-valuenow={Math.max(r.nivel, 0)} aria-label="Força da senha">
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} className="h-3 flex-1 rounded-full transition-all duration-300" style={{ background: i <= r.nivel ? CORES[r.nivel] : '#F1ECE3' }} />
          ))}
        </div>
        <p className="font-titulo font-extrabold text-xl" style={{ color: r.nivel < 0 ? '#1E3A5F' : CORES[r.nivel] }} aria-live="polite">{r.rotulo}</p>
        {r.dica && <p className="text-lg leading-snug">{r.dica}</p>}

        <ul className="space-y-1.5">
          {r.checks.map((c) => (
            <li key={c.id} className={`flex items-start gap-2 text-[1.05rem] ${c.ok ? 'text-esmeralda font-bold' : 'text-tinta/60'}`}>
              <span className={`mt-0.5 h-6 w-6 shrink-0 rounded-full border-2 flex items-center justify-center ${c.ok ? 'bg-esmeralda border-esmeralda text-white' : 'border-tinta/30'}`}>
                {c.ok && <IcCheck width={14} height={14} strokeWidth={3} />}
              </span>
              {c.texto}
            </li>
          ))}
        </ul>
        <p className="text-sm text-tinta/70">Nada é salvo. A senha fica só nesta tela, no seu celular.</p>
      </section>

      <section className="cartao-verde space-y-2" aria-labelledby="boas">
        <h2 id="boas" className="text-lg font-extrabold">Como criar uma boa senha</h2>
        <ul className="list-disc pl-5 space-y-1 text-[1.05rem]">{BOAS.map((b) => <li key={b}>{b}</li>)}</ul>
        <p className="text-[1.05rem]">Exemplo de frase (não use esta): <code className="font-bold bg-areia px-1.5 rounded">cafe-azul-bicicleta-sol</code></p>
        <AudioButton texto={`Como criar uma boa senha. ${BOAS.join(' ')}`} rotulo="Ouvir" />
      </section>

      <section className="cartao space-y-2" aria-labelledby="whats">
        <h2 id="whats" className="text-lg font-extrabold">Proteja seu WhatsApp</h2>
        <p className="text-base text-tinta/80">Toque para marcar o que você já fez.</p>
        <ul className="space-y-2">
          {WHATS.map((t, i) => (
            <li key={t}>
              <button onClick={() => marcar(i)} aria-pressed={!!marcados[i]} className="w-full min-h-[52px] flex items-start gap-3 text-left rounded-xl p-2 active:bg-areia">
                <span className={`mt-0.5 h-7 w-7 shrink-0 rounded-md border-2 border-tinta flex items-center justify-center ${marcados[i] ? 'bg-esmeralda border-esmeralda text-white' : 'bg-papel'}`}>
                  {marcados[i] && <IcCheck width={18} height={18} strokeWidth={3} />}
                </span>
                <span className={`text-[1.05rem] leading-snug ${marcados[i] ? 'line-through text-tinta/60' : ''}`}>{t}</span>
              </button>
            </li>
          ))}
        </ul>
        <AudioButton texto={`Proteja seu WhatsApp. ${WHATS.join(' ')}`} rotulo="Ouvir" />
      </section>
    </div>
  );
}
