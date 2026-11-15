// O JOIN do projeto.
// O Firestore não tem JOIN como o SQL. Então cada tentativa guarda os ids do participante e do caso
// (participanteId e casoId), e aqui buscamos esses dois documentos e juntamos tudo numa resposta só:
//
//   tentativas  JOIN participantes  ON tentativas.participanteId = participantes.id
//               JOIN casos          ON tentativas.casoId         = casos.id
const db = require('./firebase');

// Busca um documento pelo id. Devolve null se não existir.
async function buscar(colecao, id) {
  const doc = await db.collection(colecao).doc(id).get();
  return doc.exists ? { id: doc.id, ...doc.data() } : null;
}

// Recebe os documentos de "tentativas" e devolve cada um com o participante e o caso dentro.
async function juntarTentativas(docs) {
  const participantes = {}; // guarda os já buscados, para não repetir a busca
  const casos = {};
  const resultado = [];

  for (const doc of docs) {
    const t = doc.data();
    if (!(t.participanteId in participantes)) participantes[t.participanteId] = await buscar('participantes', t.participanteId);
    if (!(t.casoId in casos)) casos[t.casoId] = await buscar('casos', t.casoId);
    const p = participantes[t.participanteId];
    const c = casos[t.casoId];

    resultado.push({
      id: doc.id,
      ...t,
      participante: p ? { id: p.id, apelido: p.apelido, idioma: p.idioma } : null,
      caso: c ? { id: c.id, titulo: c.titulo, tema: c.tema, ehGolpe: c.ehGolpe } : null,
    });
  }
  return resultado;
}

module.exports = { juntarTentativas };
