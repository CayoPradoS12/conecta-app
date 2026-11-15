// Funções pequenas que as rotas usam.

// Cria um erro com código HTTP (ex.: erro(404, 'Não encontrado')). O tratador do server.js responde com ele.
const erro = (status, mensagem) => Object.assign(new Error(mensagem), { status });

// Deixa usar async/await nas rotas: se der erro, ele vai para o tratador de erros.
const rota = (fn) => (req, res, next) => fn(req, res, next).catch(next);

const agora = () => new Date().toISOString();
const hoje = () => new Date(Date.now() - 3 * 3600 * 1000).toISOString().slice(0, 10); // data no horário de Brasília

// Limpa o texto vindo do formulário.
const texto = (v) => (typeof v === 'string' ? v.trim() : '');
// Aceita uma lista ou um texto com uma linha por item.
const lista = (v) => (Array.isArray(v) ? v : texto(v).split('\n')).map((s) => String(s).trim()).filter(Boolean);

module.exports = { erro, rota, agora, hoje, texto, lista };
