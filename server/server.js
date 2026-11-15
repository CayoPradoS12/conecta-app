// Ponto de entrada do servidor: monta o Express, liga as rotas e sobe na porta 3000.
const express = require('express');
const path = require('path');
const { semearCasos } = require('./src/seed');

const app = express();
app.use(express.json());                       // lê o corpo das requisições em JSON

// Uma rota (arquivo) para cada CRUD, mais as estatísticas.
app.use('/api/participantes', require('./src/routes/participantes'));   // CRUD 1
app.use('/api/casos', require('./src/routes/casos'));                   // CRUD 2
app.use('/api/tentativas', require('./src/routes/tentativas'));         // CRUD 3 (usa o JOIN)
app.use('/api', require('./src/routes/extras'));
app.use('/api', (req, res) => res.status(404).json({ erro: 'Rota não encontrada.' }));

// Entrega o app React já compilado (pasta frontend/dist).
app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));

// Tratador de erros: devolve a mensagem em JSON com o código certo (400, 404, 409...).
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ erro: 'JSON inválido.' });
  if (!err.status) console.error(err);
  res.status(err.status || 500).json({ erro: err.status ? err.message : 'Erro interno do servidor.' });
});

const PORTA = process.env.PORT || 3000;
semearCasos()
  .then((n) => {
    if (n) console.log(`Coleção "casos" estava vazia: ${n} casos carregados.`);
    app.listen(PORTA, '0.0.0.0', () => console.log(`Conecta+ rodando em http://localhost:${PORTA}`));
  })
  .catch((e) => {
    console.error('Falha ao iniciar:', e.message);
    process.exit(1);
  });
