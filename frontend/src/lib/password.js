// Medidor de senha 100% local: nada é salvo, enviado ou registrado.
const COMUNS = [
  '123456', '1234567', '12345678', '123456789', '1234567890', '12345', '1234', '111111', '000000',
  '123123', '102030', 'abc123', 'qwerty', 'qwerty123', 'password', 'senha', 'admin', 'iloveyou',
  'brasil', 'mudar123', 'flamengo', 'corinthians', 'palmeiras', 'deus', 'amor',
];
const SEQUENCIAS = ['0123456789', 'abcdefghijklmnopqrstuvwxyz', 'qwertyuiop', 'asdfghjkl', 'zxcvbnm'];

function ehComum(pw) {
  const s = pw.toLowerCase();
  const limpa = s.replace(/[^a-z0-9]/g, '');
  return COMUNS.includes(s) || COMUNS.includes(limpa) || /^(senha|password|brasil|qwerty|admin|amor|deus)\d*$/.test(limpa);
}

function temPadrao(pw) {
  const s = pw.toLowerCase();
  if (/(.)\1{2,}/.test(s)) return true;
  for (const seq of SEQUENCIAS) {
    const rev = [...seq].reverse().join('');
    for (let i = 0; i <= seq.length - 3; i++) {
      if (s.includes(seq.slice(i, i + 3)) || s.includes(rev.slice(i, i + 3))) return true;
    }
  }
  return false;
}

export const ROTULOS = ['Muito fraca', 'Fraca', 'Média', 'Forte', 'Muito forte'];

export function avaliar(pw) {
  const n = pw.length;
  const tem = {
    min: /[a-z]/.test(pw),
    mai: /[A-Z]/.test(pw),
    num: /\d/.test(pw),
    sim: /[^A-Za-z0-9]/.test(pw),
  };
  const comum = n > 0 && ehComum(pw);
  const padrao = n > 0 && temPadrao(pw);

  const checks = [
    { id: 'tam8', ok: n >= 8, texto: 'Tem 8 letras ou mais' },
    { id: 'tam12', ok: n >= 12, texto: 'Tem 12 letras ou mais (melhor!)' },
    { id: 'mix', ok: tem.min && tem.mai, texto: 'Tem letra maiúscula e minúscula' },
    { id: 'num', ok: tem.num, texto: 'Tem número' },
    { id: 'sim', ok: tem.sim, texto: 'Tem símbolo, como - _ ! ? @' },
    { id: 'comum', ok: n > 0 && !comum, texto: 'Não é uma senha muito comum' },
    { id: 'seq', ok: n > 0 && !padrao, texto: 'Sem sequência fácil (123, abc, aaa)' },
  ];

  if (n === 0) return { nivel: -1, rotulo: 'Digite para testar', checks, dica: null };

  const base = n >= 16 ? 3 : n >= 12 ? 2.5 : n >= 8 ? 1 : n >= 6 ? 0.5 : 0;
  const classes = Object.values(tem).filter(Boolean).length;
  let pontos = base + Math.min(1.5, Math.max(0, classes - 1) * 0.5) - (padrao ? 1 : 0);
  if (comum) pontos = 0;
  const nivel = Math.max(0, Math.min(4, Math.round(pontos)));

  let dica = 'Muito bom! Use uma senha diferente em cada serviço.';
  if (comum) dica = 'Esta senha é muito comum. Golpistas testam estas primeiro.';
  else if (n < 8) dica = 'Muito curta. Tente uma frase com 4 palavras.';
  else if (padrao) dica = 'Evite sequências como 123 ou abc.';
  else if (nivel < 3) dica = 'Deixe mais longa: uma frase é melhor que uma palavra.';

  return { nivel, rotulo: ROTULOS[nivel], checks, dica };
}
