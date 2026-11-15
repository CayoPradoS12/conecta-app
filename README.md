# Conecta+ (versão Node.js + Firebase) — Projeto Final AT2N2

Aplicativo PWA para imigrantes e refugiados treinarem a identificação de golpes digitais.
**Servidor: Node.js (Express). Banco: Firebase Firestore. Front-end: React + Vite + Tailwind.**

## O que o enunciado pede e onde está
| Exigência | Onde está |
|---|---|
| Tema livre | Prevenção de golpes digitais (extensão UCB / SER+ / IMDH) |
| Servidor em Node.js | `server/` (Express): `server.js`, `src/app.js`, `src/routes/` |
| Firebase como banco | `server/src/firebase.js` (Firestore, via `firebase-admin`) |
| **3 CRUDs** | `participantes`, `casos`, `tentativas`: `server/src/routes/participantes.js`, `casos.js`, `tentativas.js`. Telas de cadastro em Início > Gestão da aula |
| **Pelo menos 1 JOIN** | `server/src/join.js`: tentativas ⨝ participantes ⨝ casos. Aparece em Gestão da aula > Histórico |
| 2 perguntas por aluno | Veja `ROTEIRO_APRESENTACAO.md` e `GUIA_DO_CODIGO.md` |

## Passo a passo para rodar

### 1. Instalar o Node.js
Baixe a versão LTS em https://nodejs.org (18 ou mais novo). Confira no terminal: `node -v`.

### 2. Criar o banco no Firebase (uma vez)
1. Entre em https://console.firebase.google.com com sua conta Google.
2. **Adicionar projeto** → nome `conecta-mais` → pode desativar o Google Analytics → **Criar projeto**.
3. No menu esquerdo: **Criação > Firestore Database** → **Criar banco de dados** → local `southamerica-east1` (São Paulo) → modo **produção** → **Ativar**.
   (O servidor usa a conta de serviço, que ignora as regras do Firestore, então não precisa mexer nas regras.)
4. Clique na engrenagem ⚙ > **Configurações do projeto** > aba **Contas de serviço** > **Gerar nova chave privada** > **Gerar chave**. Um arquivo `.json` é baixado.
5. Renomeie o arquivo para **`serviceAccountKey.json`** e coloque dentro da pasta **`server/`**.
   ⚠ Esse arquivo dá acesso total ao banco. **Nunca** envie ao GitHub nem por WhatsApp (já está no `.gitignore`).

### 3. Compilar o front-end
```bash
cd frontend
npm install
npm run build
```

### 4. Subir o servidor
```bash
cd ../server
npm install
npm start
```
Você deve ver:
```
Firestore: conectado ao Firebase (chave: serviceAccountKey.json)
Coleção "casos" estava vazia: 10 casos carregados.
Conecta+ rodando em http://localhost:3000
```
Abra **http://localhost:3000**. No Console do Firebase, em Firestore Database, aparece a coleção `casos` com 10 documentos. As coleções `participantes` e `tentativas` aparecem quando você usar o app.

### 5. Usar (roteiro de demonstração)
1. **Simulador** > escolha um apelido (nunca o nome real) > responda os casos.
2. **Início > Gestão da aula**:
   - **Participantes**: criar, editar e excluir (CRUD 1).
   - **Casos**: criar, editar e excluir casos de golpe (CRUD 2).
   - **Histórico**: lista com o **JOIN** (apelido + título do caso); registrar, inverter e excluir respostas (CRUD 3).
   - **Resultados**: acerto por caso, casos que mais confundem, CSV para o relatório.

### Modo desenvolvimento (opcional)
Dois terminais: `cd server && npm run dev` (porta 3000) e `cd frontend && npm run dev` (porta 5173, com recarga automática; o Vite repassa `/api` para a porta 3000).

## Se der erro
| Mensagem | Causa e solução |
|---|---|
| `não encontrei o arquivo serviceAccountKey.json` | Faça o passo 2.4–2.5 e confira o nome e a pasta (`server/`). |
| `Cloud Firestore API has not been used` / `PERMISSION_DENIED` / `NOT_FOUND` | O Firestore não foi criado: refaça o passo 2.3. Espere 1–2 min. |
| `EADDRINUSE` | A porta 3000 está ocupada: use `PORT=3001 npm start` (Windows: `set PORT=3001 && npm start`). |
| Tela em branco em localhost:3000 | Falta compilar o front: passo 3. |
| Erro de índice do Firestore | Não deve ocorrer: as consultas usam só um filtro de igualdade ou um `orderBy`. |

## Privacidade
Não há campo de nome, CPF, telefone ou senha. O participante é só um **apelido** (o servidor recusa apelidos que pareçam e-mail, telefone ou CPF). O medidor de senha e o verificador de mensagens rodam só no celular. O progresso pessoal fica no próprio aparelho.

## Estrutura
```
server/
  server.js            Express: rotas, arquivos da tela, tratador de erros, sobe na porta 3000
  serviceAccountKey.json   (você coloca; NÃO versionar)
  src/firebase.js      conexão com o Firestore
  src/join.js          JOIN tentativas ⨝ participantes ⨝ casos
  src/routes/          participantes.js, casos.js, tentativas.js, extras.js (estatísticas, alerta)
  src/util.js          funções pequenas (erro, data, limpar texto)
  src/seed.js          carrega os 10 casos na 1ª execução
  seed/                casos.json, alertas.json
frontend/              React + Vite + Tailwind (PWA)
  src/screens/         Inicio, Simulador, Senhas, Tradutor, Gestao
  src/lib/api.js       fetch para a API
```

## Publicar (opcional)
Render/Railway: *Build* `cd frontend && npm install && npm run build && cd ../server && npm install`; *Start* `cd server && npm start`. Guarde a chave como "Secret File" e aponte `FIREBASE_KEY_PATH` para ela.
