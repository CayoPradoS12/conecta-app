// CRUD 3: TENTATIVAS (cada resposta de um participante a um caso). A listagem usa o JOIN.
const express = require('express');
const db = require('../firebase');
const { erro, rota, agora, hoje } = require('../util');
const { juntarTentativas } = require('../join');

const router = express.Router();
const tentativas = db.collection('tentativas');

// Confere se o participante e o caso existem e calcula se acertou.
// O cálculo é feito aqui, no servidor, para o navegador não poder "trapacear" no resultado.
async function montar(body) {
  if (typeof body.respondeuGolpe !== 'boolean') throw erro(400, 'Informe respondeuGolpe (true ou false).');
  if (!body.participanteId || !body.casoId) throw erro(400, 'Informe participanteId e casoId.');

  const participante = await db.collection('participantes').doc(String(body.participanteId)).get();
  const caso = await db.collection('casos').doc(String(body.casoId)).get();
  if (!participante.exists) throw erro(404, 'Participante não encontrado.');
  if (!caso.exists) throw erro(404, 'Caso não encontrado.');

  return {
    participanteId: participante.id,
    casoId: caso.id,
    respondeuGolpe: body.respondeuGolpe,
    acertou: body.respondeuGolpe === caso.data().ehGolpe, // acertou se a resposta bate com o caso
  };
}

// READ: lista COM JOIN. Filtros opcionais: ?participanteId=...&casoId=...
router.get('/', rota(async (req, res) => {
  let consulta = tentativas;
  if (req.query.participanteId) consulta = consulta.where('participanteId', '==', String(req.query.participanteId));
  if (req.query.casoId) consulta = consulta.where('casoId', '==', String(req.query.casoId));
  const snap = await consulta.get();
  const resultado = await juntarTentativas(snap.docs);
  resultado.sort((a, b) => (b.criadoEm || '').localeCompare(a.criadoEm || '')); // mais recentes primeiro
  res.json(resultado);
}));

// READ: uma só, também com JOIN
router.get('/:id', rota(async (req, res) => {
  const doc = await tentativas.doc(req.params.id).get();
  if (!doc.exists) throw erro(404, 'Tentativa não encontrada.');
  res.json((await juntarTentativas([doc]))[0]);
}));

// CREATE
router.post('/', rota(async (req, res) => {
  const dados = { ...(await montar(req.body)), dia: hoje(), criadoEm: agora() };
  const ref = await tentativas.add(dados);
  res.status(201).json({ id: ref.id, ...dados });
}));

// UPDATE: corrige a resposta (o servidor recalcula se acertou)
router.put('/:id', rota(async (req, res) => {
  const ref = tentativas.doc(req.params.id);
  const atual = await ref.get();
  if (!atual.exists) throw erro(404, 'Tentativa não encontrada.');
  const dados = await montar({ participanteId: atual.data().participanteId, casoId: atual.data().casoId, ...req.body });
  await ref.update(dados);
  res.json((await juntarTentativas([await ref.get()]))[0]);
}));

// DELETE
router.delete('/:id', rota(async (req, res) => {
  const ref = tentativas.doc(req.params.id);
  if (!(await ref.get()).exists) throw erro(404, 'Tentativa não encontrada.');
  await ref.delete();
  res.json({ ok: true });
}));

module.exports = router;
