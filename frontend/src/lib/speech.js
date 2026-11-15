// Áudio em português com a Web Speech API (funciona offline na maioria dos celulares).
export const suportaFala = () => typeof window !== 'undefined' && 'speechSynthesis' in window;

function escolherVoz() {
  const vs = window.speechSynthesis.getVoices();
  return vs.find((v) => /^pt[-_]BR/i.test(v.lang)) || vs.find((v) => /^pt/i.test(v.lang)) || null;
}

export function getVelocidade() {
  try {
    const v = parseFloat(localStorage.getItem('cm_velocidade'));
    return Number.isNaN(v) ? 0.9 : v;
  } catch {
    return 0.9;
  }
}

export function setVelocidade(v) {
  try { localStorage.setItem('cm_velocidade', String(v)); } catch { /* sem armazenamento */ }
}

export function falar(texto, aoTerminar) {
  if (!suportaFala()) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(texto);
  u.lang = 'pt-BR';
  const voz = escolherVoz();
  if (voz) u.voice = voz;
  u.rate = getVelocidade();
  u.onend = u.onerror = () => aoTerminar && aoTerminar();
  window.speechSynthesis.speak(u);
}

export function parar() {
  if (suportaFala()) window.speechSynthesis.cancel();
}

// Algumas vozes só aparecem depois deste evento.
if (suportaFala()) window.speechSynthesis.onvoiceschanged = () => {};
