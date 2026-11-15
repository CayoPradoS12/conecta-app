// CRUD 2: CASOS DE GOLPE (o conteúdo que aparece no Simulador)
const express = require('express');
const db = require('../firebase');
const { erro, rota, texto, lista } = require('../util');

const router = express.Router();
const casos = db.collection('casos');

// Confere os dados do caso. `criando` é true no POST (precisa de um id).
function validar(body, criando) {
  const caso = {
    tema: texto(body.tema),
    titulo: texto(body.titulo),
    grupo: texto(body.grupo) || 'extra',
    canal: texto(body.canal),
    remetente: texto(body.remetente),
    contexto: texto(body.contexto),
    mensagens: lista(body.mensagens),
    ehGolpe: body.ehGolpe === true || body.ehGolpe === 'true',
    explicacao: texto(body.explicacao),
    sinais: lista(body.sinais),
    oQueFazer: lista(body.oQueFazer),
    ordem: Number.isFinite(Number(body.ordem)) ? Number(body.ordem) : 99,
  };
  const informouGolpe = typeof body.ehGolpe === 'boolean' || body.ehGolpe === 'true' || body.ehGolpe === 'false';
  if (!informouGolpe) throw erro(400, 'Informe se o caso é golpe (true) ou seguro (false).');
  if (caso.titulo.length < 3) throw erro(400, 'Informe o título do caso.');
  if (!['essencial', 'extra'].includes(caso.grupo)) throw erro(400, 'Grupo deve ser "essencial" ou "extra".');
  if (caso.mensagens.length === 0) throw erro(400, 'Informe ao menos uma mensagem.');
  if (caso.explicacao.length < 10) throw erro(400, 'Escreva a explicação do caso.');
  if (criando) {
    const id = texto(body.id);
    if (!/^[a-z0-9-]{2,40}$/.test(id)) throw erro(400, 'O id deve ter 2 a 40 letras minúsculas, números ou hífen.');
    caso.id = id;
  }
  return caso;
}

// READ: lista, na ordem do simulador
router.get('/', rota(async (req, res) => {
  const snap = await casos.orderBy('ordem').get();
  res.json(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
}));

// READ: um só
router.get('/:id', rota(async (req, res) => {
  const doc = await casos.doc(req.params.id).get();
  if (!doc.exists) throw erro(404, 'Caso não encontrado.');
  res.json({ id: doc.id, ...doc.data() });
}));

// CREATE (o id é um nome curto escolhido pela equipe, ex.: "golpe-nubank")
router.post('/', rota(async (req, res) => {
  const { id, ...dados } = validar(req.body, true);
  if ((await casos.doc(id).get()).exists) throw erro(409, 'Já existe um caso com esse id.');
  await casos.doc(id).set(dados);
  res.status(201).json({ id, ...dados });
}));

// UPDATE
router.put('/:id', rota(async (req, res) => {
  const ref = casos.doc(req.params.id);
  if (!(await ref.get()).exists) throw erro(404, 'Caso não encontrado.');
  const dados = validar(req.body, false);
  await ref.set(dados);
  res.json({ id: ref.id, ...dados });
}));

// DELETE: apaga o caso e as respostas dadas a ele
router.delete('/:id', rota(async (req, res) => {
  const ref = casos.doc(req.params.id);
  if (!(await ref.get()).exists) throw erro(404, 'Caso não encontrado.');
  const tentativas = await db.collection('tentativas').where('casoId', '==', ref.id).get();
  for (const t of tentativas.docs) await t.ref.delete();
  await ref.delete();
  res.json({ ok: true, tentativasApagadas: tentativas.size });
}));

module.exports = router;
