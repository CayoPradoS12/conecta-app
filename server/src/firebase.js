// Conexão com o Firebase Firestore (o banco de dados do projeto).
// Precisa do arquivo serviceAccountKey.json (a "chave" do projeto) dentro da pasta server/.
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const caminhoChave = process.env.FIREBASE_KEY_PATH || path.join(__dirname, '..', 'serviceAccountKey.json');

if (!fs.existsSync(caminhoChave)) {
  console.error(
    '\nERRO: não encontrei o arquivo serviceAccountKey.json em server/.\n' +
      'Baixe a chave no Console do Firebase (Configurações do projeto > Contas de serviço >\n' +
      'Gerar nova chave privada) e salve como server/serviceAccountKey.json.\n' +
      'Veja o passo a passo no README.md.\n'
  );
  process.exit(1);
}

admin.initializeApp({ credential: admin.credential.cert(require(caminhoChave)) });
console.log('Firestore: conectado ao Firebase.');

module.exports = admin.firestore();
