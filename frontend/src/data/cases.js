/**
 * Casos do Simulador. Textos em português simples (frases curtas).
 * Marcação [[assim]] = trecho suspeito, sublinhado em terracota depois que a pessoa responde.
 * IDs devem bater com CASOS em backend/main.py.
 */
export const CASOS = [
  {
    id: 'pix',
    grupo: 'essencial',
    tema: 'Pix',
    titulo: 'Pix enviado por engano',
    canal: 'WhatsApp',
    remetente: 'Número desconhecido',
    contexto: 'Você recebe esta mensagem de alguém que você não conhece.',
    mensagens: [
      'Oi, tudo bem? Fiz um Pix de [[R$ 480]] para você por engano.',
      'Pode devolver agora? É [[urgente]], é o dinheiro do aluguel. Segue o comprovante.',
      '[Imagem: comprovante de Pix]',
    ],
    ehGolpe: true,
    explicacao:
      'É golpe. O comprovante pode ser falso, e o dinheiro talvez nem tenha chegado. Quem pede "devolva agora" quer que você faça um Pix novo, de verdade, para a conta dele.',
    sinais: [
      'Pessoa desconhecida pedindo dinheiro.',
      'Pressa: "urgente", "agora".',
      'Comprovante em foto. Foto é fácil de falsificar.',
    ],
    oQueFazer: [
      'Abra o aplicativo do seu banco e veja se o dinheiro chegou.',
      'Se chegou, não faça um Pix novo. Use a opção "Devolver" dentro do banco.',
      'Se não chegou, não faça nada. Bloqueie o número.',
    ],
  },
  {
    id: 'gerente',
    grupo: 'essencial',
    tema: 'Banco',
    titulo: 'Falso gerente de banco',
    canal: 'WhatsApp',
    remetente: 'Gerente - Segurança do Banco',
    contexto: 'Alguém que diz ser do seu banco escreve para você.',
    mensagens: [
      'Bom dia. Aqui é o gerente do seu banco, do setor de segurança.',
      'Vimos uma compra de [[R$ 2.300]] no seu cartão. Para [[cancelar agora]], me diga o [[código que chegou por SMS]].',
      'Se o senhor demorar, sua conta será [[bloqueada]].',
    ],
    ehGolpe: true,
    explicacao:
      'É golpe. O banco nunca pede senha, código de SMS ou dados do cartão por mensagem ou telefone. O código serve para o golpista entrar na sua conta.',
    sinais: [
      'Pede o código do SMS.',
      'Medo e pressa: "conta bloqueada", "cancelar agora".',
      'O banco não chama você pelo WhatsApp para pedir dados.',
    ],
    oQueFazer: [
      'Não passe nenhum código. Pare a conversa.',
      'Ligue para o número que está atrás do seu cartão.',
      'Bloqueie o contato e denuncie no WhatsApp.',
    ],
  },
  {
    id: 'correios',
    grupo: 'essencial',
    tema: 'Link',
    titulo: 'Encomenda retida',
    canal: 'SMS',
    remetente: '+55 11 9xxxx-xxxx',
    contexto: 'Chega uma mensagem de texto no seu celular.',
    mensagens: [
      'Correios: sua encomenda ficou retida. Pague a taxa de [[R$ 7,90]] em [[correios-entrega-br.top/taxa]] até [[hoje]], ou ela será devolvida.',
    ],
    ehGolpe: true,
    explicacao:
      'É golpe. O endereço verdadeiro dos Correios termina em correios.com.br. Este link é de outro site, feito para copiar seus dados de cartão.',
    sinais: [
      'O endereço do link não é o site oficial.',
      'Cobra uma taxa pequena para parecer inofensivo.',
      'Prazo curto: "até hoje".',
    ],
    oQueFazer: [
      'Não toque no link.',
      'Se espera uma encomenda, abra o site oficial digitando você mesmo: correios.com.br.',
      'Apague a mensagem e bloqueie o número.',
    ],
  },
  {
    id: 'vaga',
    grupo: 'essencial',
    tema: 'Emprego',
    titulo: 'Vaga fácil, salário alto',
    canal: 'WhatsApp',
    remetente: 'RH Vagas Brasil',
    contexto: 'Você procurava trabalho. Alguém manda esta mensagem.',
    mensagens: [
      'Vaga de auxiliar administrativo: [[R$ 3.500]] por mês, [[sem experiência]], trabalhe de casa!',
      'Para começar, pague [[R$ 150]] do uniforme e envie foto do seu [[RG e CPF]].',
    ],
    ehGolpe: true,
    explicacao:
      'É golpe. Empresa séria não cobra para você começar a trabalhar. O salário alto sem experiência é a isca. Seus documentos podem ser usados para abrir contas em seu nome.',
    sinais: [
      'Cobra dinheiro (uniforme, curso, taxa).',
      'Salário muito alto, sem experiência.',
      'Pede foto de documentos antes de qualquer conversa.',
    ],
    oQueFazer: [
      'Não pague nada e não envie documentos.',
      'Procure a empresa pelo site ou pelo telefone oficial.',
      'Peça ajuda ao seu professor ou ao IMDH para achar vagas de confiança.',
    ],
  },
  {
    id: 'codigo',
    grupo: 'essencial',
    tema: 'WhatsApp',
    titulo: 'Amigo pede o código',
    canal: 'WhatsApp',
    remetente: 'Rafa (amigo salvo no seu celular)',
    contexto: 'Um amigo que você conhece manda mensagem.',
    mensagens: [
      'Oi! Coloquei seu número sem querer para receber um código.',
      'Chegou no seu celular? Me [[passa o código de 6 dígitos]], por favor! Preciso [[agora]], é rapidinho.',
    ],
    ehGolpe: true,
    explicacao:
      'É golpe. A conta do seu amigo foi invadida. Se você passar o código, o golpista toma a sua conta de WhatsApp e pede dinheiro aos seus contatos.',
    sinais: [
      'Pede o código de 6 números do WhatsApp.',
      'Pressa, mesmo vindo de alguém conhecido.',
      'Mensagem curta, sem detalhes da vida real do amigo.',
    ],
    oQueFazer: [
      'Nunca passe esse código, nem para amigos.',
      'Ligue para o amigo e avise: a conta dele foi invadida.',
      'Ative a verificação em duas etapas no WhatsApp (veja a aba Senhas).',
    ],
  },
  {
    id: 'sorteio',
    grupo: 'essencial',
    tema: 'Sorteio',
    titulo: 'Você ganhou um prêmio!',
    canal: 'WhatsApp',
    remetente: 'Promoção Bom Preço',
    contexto: 'Você não lembra de ter participado de nenhum sorteio.',
    mensagens: [
      'PARABÉNS! Você ganhou um [[celular novo]] no sorteio do Supermercado Bom Preço!',
      'Para receber, toque em [[bit.ly/premio-bompreco]] e informe seu [[CPF]] e a [[taxa de entrega de R$ 29]].',
    ],
    ehGolpe: true,
    explicacao:
      'É golpe. Ninguém ganha sorteio em que não participou. Prêmio de verdade não pede taxa e não pede CPF por link. O link encurtado esconde o site verdadeiro.',
    sinais: [
      'Você não participou de sorteio nenhum.',
      'Pede uma taxa para entregar o prêmio.',
      'Link encurtado (bit.ly) que esconde o destino.',
    ],
    oQueFazer: [
      'Não toque no link e não envie o CPF.',
      'Pergunte no próprio mercado, pessoalmente ou pelo telefone oficial.',
      'Bloqueie e denuncie o número.',
    ],
  },
  {
    id: 'rh-presencial',
    grupo: 'extra',
    tema: 'Documentos',
    titulo: 'Convite para entrevista',
    canal: 'WhatsApp',
    remetente: 'Padaria Estrela',
    contexto: 'Ontem você levou seu currículo na Padaria Estrela, no seu bairro.',
    mensagens: [
      'Bom dia! Aqui é a Ana, da Padaria Estrela.',
      'Gostamos do seu currículo. Venha amanhã às 9h, na loja da Rua das Flores, para conversar.',
      'Traga seu RG e sua carteira de trabalho, se tiver. Não precisa enviar nada por aqui.',
    ],
    ehGolpe: false,
    explicacao:
      'Parece seguro. Você conhece o lugar e deixou o currículo lá. A conversa é pessoalmente. Ninguém pede dinheiro, link, código ou foto de documento por mensagem.',
    sinais: [
      'Você mesmo procurou essa empresa.',
      'Encontro em lugar real, de dia.',
      'Documentos só em mãos, não por WhatsApp.',
      'Nenhum pedido de dinheiro.',
    ],
    oQueFazer: [
      'Confirme indo à loja ou ligando para o número que você já tinha.',
      'Leve os documentos apenas no dia, e só mostre ao responsável.',
      'Se algo mudar (pedir taxa, mudar de lugar), desconfie.',
    ],
  },
  {
    id: 'selfie-rg',
    grupo: 'extra',
    tema: 'Documentos',
    titulo: 'Selfie com RG para o auxílio',
    canal: 'WhatsApp',
    remetente: 'Benefício Social 2026',
    contexto: 'Alguém que você não conhece escreve sobre um benefício.',
    mensagens: [
      'Seu cadastro para o [[auxílio]] foi aprovado!',
      'Envie uma [[selfie segurando seu RG]] e o comprovante de residência neste WhatsApp para liberar o [[pagamento hoje]].',
    ],
    ehGolpe: true,
    explicacao:
      'É golpe. Com sua selfie e seu documento, o golpista pode abrir contas e pedir empréstimos no seu nome. Benefícios do governo não são liberados por WhatsApp de desconhecidos.',
    sinais: [
      'Pede selfie com documento.',
      'Você não pediu benefício nenhum.',
      'Promete pagamento rápido.',
    ],
    oQueFazer: [
      'Não envie fotos de documentos.',
      'Para benefícios, procure o CRAS ou os sites oficiais do governo (terminam em gov.br).',
      'Bloqueie e denuncie o número.',
    ],
  },
  {
    id: 'app-banco',
    grupo: 'extra',
    tema: 'Banco',
    titulo: 'Aviso no aplicativo do banco',
    canal: 'Notificação',
    remetente: 'Aplicativo do seu banco',
    contexto: 'Uma notificação aparece no aplicativo do banco que você já instalou e usa.',
    mensagens: [
      'Pix de R$ 50,00 enviado para Mercado da Rua. Foi você? Se não reconhece, abra o aplicativo e toque em "Contestar".',
    ],
    ehGolpe: false,
    explicacao:
      'Parece seguro. O aviso vem do aplicativo oficial, que você já usa. Ele só informa a compra e manda você abrir o próprio app. Não pede senha, código nem link.',
    sinais: [
      'Vem do aplicativo oficial que você instalou.',
      'Não pede senha, código ou dinheiro.',
      'Manda você abrir o aplicativo para conferir.',
    ],
    oQueFazer: [
      'Abra o aplicativo você mesmo e confira a lista de movimentos.',
      'Se não reconhece o Pix, use "Contestar" dentro do app.',
      'Ligue para o número do cartão se tiver dúvida.',
    ],
  },
  {
    id: 'grupo-whatsapp',
    grupo: 'extra',
    tema: 'WhatsApp',
    titulo: 'Grupo "Renda Extra VIP"',
    canal: 'Grupo de WhatsApp',
    remetente: 'Você foi adicionado por um número desconhecido',
    contexto: 'De repente, você está dentro de um grupo com 200 pessoas.',
    mensagens: [
      'Participante: Ontem coloquei R$ 100 e hoje recebi [[R$ 500]]!',
      'Admin: Última chance! Faça um Pix de [[R$ 100]] e [[dobre seu dinheiro em 1 dia]].',
    ],
    ehGolpe: true,
    explicacao:
      'É golpe. Ninguém dobra dinheiro em um dia. Os "participantes" que comemoram são do próprio golpe. Quem faz o Pix perde o dinheiro.',
    sinais: [
      'Promessa de lucro rápido e sem risco.',
      'Depoimentos que parecem combinados.',
      'Pede Pix para entrar.',
    ],
    oQueFazer: [
      'Saia do grupo e não faça Pix.',
      'Em WhatsApp: Configurações > Privacidade > Grupos > "Meus contatos". Assim, estranhos não adicionam você.',
      'Denuncie o grupo.',
    ],
  },
];

export const ESSENCIAIS = CASOS.filter((c) => c.grupo === 'essencial');
export const EXTRAS = CASOS.filter((c) => c.grupo === 'extra');

/** Remove marcações [[ ]] e linhas de imagem para o áudio. */
export function textoParaAudio(caso) {
  return caso.mensagens
    .filter((m) => !m.startsWith('[Imagem'))
    .map((m) => m.replace(/\[\[|\]\]/g, ''))
    .join(' ');
}

export function explicacaoParaAudio(caso) {
  return `${caso.explicacao} Sinais: ${caso.sinais.join(' ')} O que fazer: ${caso.oQueFazer.join(' ')}`;
}
