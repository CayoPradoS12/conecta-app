// Verificador local de mensagens e links. Roda no aparelho: o texto nunca é enviado.
// É um ajudante para aprender os sinais. Não é garantia, e a tela diz isso.

const MARCAS = {
  correios: ['correios.com.br'],
  nubank: ['nubank.com.br'],
  itau: ['itau.com.br'],
  bradesco: ['bradesco.com.br'],
  santander: ['santander.com.br'],
  caixa: ['caixa.gov.br'],
  mercadolivre: ['mercadolivre.com.br', 'mercadolivre.com'],
  whatsapp: ['whatsapp.com'],
  gov: ['gov.br'],
  receita: ['gov.br'],
  inss: ['gov.br'],
  pix: ['bcb.gov.br'],
};
const ENCURTADORES = /(^|\.)(bit\.ly|tinyurl\.com|t\.co|cutt\.ly|is\.gd|goo\.gl|rb\.gy|ow\.ly|shorturl\.at)$/i;
const TLD_SUSPEITO = /\.(top|xyz|click|online|site|shop|buzz|icu|cfd|live|vip|monster|rest)$/i;

function extrairHosts(texto) {
  const re = /(?:https?:\/\/)?((?:[a-z0-9-]+\.)+[a-z]{2,})(?:[/:?#]\S*)?/gi;
  const hosts = new Set();
  let m;
  while ((m = re.exec(texto))) hosts.add(m[1].toLowerCase());
  return [...hosts];
}

const REGRAS_TEXTO = [
  {
    peso: 4,
    teste: (t) => /(c[oó]digo|senha|token|cvv|n[uú]mero do cart[aã]o)/i.test(t) && /(envi|pass|inform|confirm|mand|digit|diga|fale)/i.test(t),
    motivo: 'Pede código, senha ou dados do cartão. Ninguém sério pede isso por mensagem.',
  },
  {
    peso: 3,
    teste: (t) => /(taxa|pague|pagar|pagamento|deposite|dep[oó]sito|fa[cç]a um pix|boleto|transfer[eê]ncia)/i.test(t),
    motivo: 'Pede dinheiro ou pagamento.',
  },
  {
    peso: 2,
    teste: (t) => /(urgente|agora mesmo|imediatamente|[uú]ltim[ao] (chance|dia)|hoje|expira|bloquead|suspens|cancelad|em \d+ (horas|minutos))/i.test(t),
    motivo: 'Cria pressa ou medo ("urgente", "bloqueada", "hoje").',
  },
  {
    peso: 2,
    teste: (t) => /(ganhou|parab[eé]ns|sorteio|pr[eê]mio|promo[cç][aã]o|gr[aá]tis|brinde)/i.test(t),
    motivo: 'Fala de prêmio ou promoção. Você participou de algo?',
  },
  {
    peso: 2,
    teste: (t) => /(\brg\b|\bcpf\b|\bcnh\b|selfie|foto (do|de) (documento|rg|cpf)|comprovante de resid)/i.test(t),
    motivo: 'Pede documentos ou dados pessoais.',
  },
  {
    peso: 2,
    teste: (t) => /(sem experi[eê]ncia|trabalhe de casa|renda extra|ganhe .{0,20}por (dia|semana)|dobre seu dinheiro|lucro garantido)/i.test(t),
    motivo: 'Promete dinheiro fácil ou trabalho sem esforço.',
  },
  {
    peso: 2,
    teste: (t) => /(n[uú]mero novo|troquei de n[uú]mero|mudei de n[uú]mero|novo whatsapp)/i.test(t),
    motivo: 'Diz que mudou de número. Golpistas fingem ser conhecidos.',
  },
  {
    peso: 2,
    teste: (t) => /(n[aã]o conte|segredo|n[aã]o fale para ningu[eé]m)/i.test(t),
    motivo: 'Pede segredo.',
  },
];

function analisarHost(host) {
  const motivos = [];
  let pontos = 0;
  if (ENCURTADORES.test(host)) {
    pontos += 3;
    motivos.push(`O link "${host}" é encurtado. Ele esconde o site verdadeiro.`);
  }
  if (TLD_SUSPEITO.test(host)) {
    pontos += 3;
    motivos.push(`O endereço "${host}" termina de um jeito pouco comum em sites oficiais.`);
  }
  if (/^\d+\.\d+\.\d+\.\d+$/.test(host)) {
    pontos += 4;
    motivos.push('O link usa só números em vez de um nome de site.');
  }
  for (const [marca, oficiais] of Object.entries(MARCAS)) {
    const noNome = host.split('.').some((p) => p.split('-').includes(marca));
    const ehOficial = oficiais.some((o) => host === o || host.endsWith(`.${o}`));
    if (noNome && !ehOficial) {
      pontos += 4;
      motivos.push(`O endereço "${host}" lembra "${marca}", mas não é o site oficial (${oficiais[0]}).`);
      break;
    }
  }
  return { pontos, motivos };
}

export function verificar(texto) {
  const t = texto.trim();
  if (!t) return null;
  let pontos = 0;
  const motivos = [];

  for (const r of REGRAS_TEXTO) {
    if (r.teste(t)) {
      pontos += r.peso;
      motivos.push(r.motivo);
    }
  }
  for (const h of extrairHosts(t)) {
    const a = analisarHost(h);
    pontos += a.pontos;
    motivos.push(...a.motivos);
  }

  const nivel = pontos >= 6 ? 'alto' : pontos >= 3 ? 'medio' : 'baixo';
  return { nivel, pontos, motivos };
}
