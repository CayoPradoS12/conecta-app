// CRUD 1: PARTICIPANTES
// Privacidade: o participante é só um APELIDO de treino (ex.: "Girassol 7"), nunca nome, CPF ou telefone.
const express = require('express');
const db = require('../firebase');
const { erro, rota, agora, texto } = require('../util');

const router = express.Router();
const participantes = db.collection('participantes');
const IDIOMAS = ['pt', 'es', 'en', 'fr', 'ht'];

// Confere os dados enviados. Se algo estiver errado, responde 400 com a mensagem.
function validar(body) {
  const apelido = texto(body.apelido);
  const idioma = texto(body.idioma) || 'pt';
  if (apelido.length < 2 || apelido.length > 30) throw erro(400, 'O apelido deve ter de 2 a 30 caracteres.');
  // Recusa o que parece e-mail, telefone ou CPF.
  if (/@|\d{8,}|\d{3}[.\s-]?\d{3}[.\s-]?\d{3}/.test(apelido))
    throw erro(400, 'Não use nome real, CPF, e-mail ou telefone. Escolha um apelido.');
  if (!IDIOMAS.includes(idioma)) throw erro(400, 'Idioma inválido.');
  return { apelido, idioma };
}

// READ: lista todos
router.get('/', rota(async (req, res) => {
  const snap = await participantes.orderBy('criadoEm').get();
  res.json(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
}));

// READ: um só
router.get('/:id', rota(async (req, res) => {
  const doc = await participantes.doc(req.params.id).get();
  if (!doc.exists) throw erro(404, 'Participante não encontrado.');
  res.json({ id: doc.id, ...doc.data() });
}));

// CREATE
router.post('/', rota(async (req, res) => {
  const dados = { ...validar(req.body), criadoEm: agora() };
  const ref = await participantes.add(dados);
  res.status(201).json({ id: ref.id, ...dados });
}));

// UPDATE
router.put('/:id', rota(async (req, res) => {
  const ref = participantes.doc(req.params.id);
  if (!(await ref.get()).exists) throw erro(404, 'Participante não encontrado.');
  await ref.update(validar(req.body));
  res.json({ id: ref.id, ...(await ref.get()).data() });
}));

// DELETE: apaga o participante e também as respostas dele (para não sobrar registro sem dono)
router.delete('/:id', rota(async (req, res) => {
  const ref = participantes.doc(req.params.id);
  if (!(await ref.get()).exists) throw erro(404, 'Participante não encontrado.');
  const tentativas = await db.collection('tentativas').where('participanteId', '==', ref.id).get();
  for (const t of tentativas.docs) await t.ref.delete();
  await ref.delete();
  res.json({ ok: true, tentativasApagadas: tentativas.size });
}));

module.exports = router;
