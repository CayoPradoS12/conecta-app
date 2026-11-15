// Na primeira vez que o servidor roda, grava os 10 casos de golpe no Firestore.
const db = require('./firebase');
const casos = require('../seed/casos.json');

async function semearCasos() {
  const existentes = await db.collection('casos').limit(1).get();
  if (!existentes.empty) return 0;                       // já tem casos: não faz nada
  for (const { id, ...dados } of casos) {
    await db.collection('casos').doc(id).set(dados);
  }
  return casos.length;
}

module.exports = { semearCasos };
