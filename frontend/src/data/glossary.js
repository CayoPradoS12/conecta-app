/**
 * Glossário de tecnologia no Brasil, em português simples.
 * IMPORTANTE: peça a falantes nativos (especialmente de Crioulo Haitiano e Francês) para revisar
 * as traduções antes de usar com o público. Para corrigir, edite este arquivo.
 */
export const IDIOMAS = [
  { id: 'es', nome: 'Español', rotulo: 'Espanhol' },
  { id: 'en', nome: 'English', rotulo: 'Inglês' },
  { id: 'fr', nome: 'Français', rotulo: 'Francês' },
  { id: 'ht', nome: 'Kreyòl ayisyen', rotulo: 'Crioulo haitiano' },
];

const t = (pt, def, es, en, fr, ht, cat = 'Geral') => ({ pt, def, cat, es, en, fr, ht });

export const GLOSSARIO = [
  t('golpe', 'Mentira para tirar seu dinheiro ou seus dados.', 'estafa', 'scam', 'arnaque', 'eskwokri', 'Golpes'),
  t('golpista', 'Pessoa que faz o golpe.', 'estafador', 'scammer', 'escroc', 'eskwòk', 'Golpes'),
  t('mensagem suspeita', 'Mensagem que parece estranha ou pede algo que você não esperava.', 'mensaje sospechoso', 'suspicious message', 'message suspect', 'mesaj sispèk', 'Golpes'),
  t('perfil falso', 'Conta de rede social com nome e foto de outra pessoa.', 'perfil falso', 'fake profile', 'faux profil', 'fo pwofil', 'Golpes'),
  t('taxa', 'Dinheiro extra que alguém cobra. Emprego e prêmio de verdade não cobram taxa.', 'tarifa / cargo extra', 'fee', 'frais', 'frè', 'Golpes'),
  t('sorteio', 'Escolha de um ganhador por sorte. Só ganha quem participou.', 'sorteo', 'prize draw', 'tirage au sort', 'tiraj osò', 'Golpes'),
  t('prêmio', 'Presente que se ganha em um sorteio.', 'premio', 'prize', 'lot / prix', 'pri', 'Golpes'),
  t('vaga de emprego', 'Oferta de trabalho.', 'oferta de empleo', 'job opening', "offre d'emploi", 'ofr travay', 'Golpes'),
  t('denunciar', 'Avisar o aplicativo ou a polícia sobre um golpe.', 'denunciar / reportar', 'report', 'signaler', 'denonse', 'Golpes'),
  t('bloquear', 'Impedir que uma pessoa fale com você.', 'bloquear', 'block', 'bloquer', 'bloke', 'Golpes'),
  t('senha', 'Palavra secreta para entrar no celular, no banco ou no aplicativo. Só você deve saber.', 'contraseña', 'password', 'mot de passe', 'modpas', 'Segurança'),
  t('código de verificação', 'Número que chega por SMS ou WhatsApp. Não passe para ninguém.', 'código de verificación', 'verification code', 'code de vérification', 'kòd verifikasyon', 'Segurança'),
  t('verificação em duas etapas', 'Uma segunda chave de segurança, além da senha.', 'verificación en dos pasos', 'two-step verification', 'vérification en deux étapes', 'verifikasyon an de etap', 'Segurança'),
  t('dados pessoais', 'Informações sobre você: nome, endereço, telefone, documentos.', 'datos personales', 'personal data', 'données personnelles', 'done pèsonèl', 'Segurança'),
  t('link', 'Endereço azul na mensagem. Se você toca, abre um site.', 'enlace', 'link', 'lien', 'lyen', 'Internet'),
  t('aplicativo', 'Programa que você instala no celular. Também se diz "app".', 'aplicación', 'app', 'application', 'aplikasyon', 'Internet'),
  t('cadastro', 'Preencher seus dados para criar uma conta.', 'registro', 'sign-up', 'inscription', 'enskripsyon', 'Internet'),
  t('Pix', 'Jeito rápido de mandar dinheiro pelo celular. É difícil desfazer.', 'transferencia instantánea (Pix)', 'instant payment (Pix)', 'paiement instantané (Pix)', 'peman rapid (Pix)', 'Dinheiro'),
  t('transferência', 'Mandar dinheiro de uma conta para outra.', 'transferencia', 'transfer', 'virement', 'transfè', 'Dinheiro'),
  t('boleto', 'Papel ou código para pagar uma conta. Confira o nome de quem recebe.', 'boleto de pago', 'payment slip (bill)', 'bordereau de paiement', 'fakti peman', 'Dinheiro'),
  t('CPF', 'Número de cadastro de pessoa no Brasil. Dê só quando for realmente necessário.', 'número de contribuyente (CPF)', 'taxpayer ID (CPF)', 'numéro de contribuable (CPF)', 'nimewo kontribyab (CPF)', 'Documentos'),
  t('RG', 'Documento de identidade brasileiro.', 'documento de identidad (RG)', 'ID card (RG)', "carte d'identité (RG)", 'kat idantite (RG)', 'Documentos'),
];

export const FRASES = [
  t('Isso é golpe?', 'Use para perguntar a alguém de confiança.', '¿Es una estafa?', 'Is this a scam?', "C'est une arnaque ?", 'Èske sa se yon eskwokri ?'),
  t('Não vou passar meu código.', 'Use quando pedirem seu código.', 'No voy a dar mi código.', "I won't give my code.", 'Je ne donne pas mon code.', 'Mwen p ap bay kòd mwen.'),
  t('Vou ligar para o banco.', 'Use quando alguém disser que é do banco.', 'Voy a llamar al banco.', "I'll call the bank.", "Je vais appeler la banque.", 'M ap rele bank la.'),
  t('Pode falar mais devagar?', 'Use para pedir ajuda com o idioma.', '¿Puede hablar más despacio?', 'Can you speak more slowly?', 'Pouvez-vous parler plus lentement ?', 'Ou ka pale pi dousman ?'),
];
