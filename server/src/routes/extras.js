// Rotas de apoio: estatísticas da turma (painel de Gestão), planilha CSV e o alerta do dia.
const express = require('express');
const db = require('../firebase');
const { rota, hoje } = require('../util');
const alertas = require('../../seed/alertas.json');

const router = express.Router();

// Arredonda para 1 casa decimal: 2/3 vira 66.7
const porcento = (parte, total) => (total ? Math.round((1000 * parte) / total) / 10 : null);

// Lê casos e tentativas do Firestore e conta os acertos.
async function calcularEstatisticas() {
  const casosSnap = await db.collection('casos').orderBy('ordem').get();
  const tentSnap = await db.collection('tentativas').get();
  const tentativas = tentSnap.docs.map((d) => d.data());

  // Acertos e erros de cada caso
  const casos = casosSnap.docs.map((d) => {
    const dele = tentativas.filter((t) => t.casoId === d.id);
    const acertos = dele.filter((t) => t.acertou).length;
    return {
      caso_id: d.id,
      titulo: d.data().titulo,
      tentativas: dele.length,
      acertos,
      erros: dele.length - acertos,
      taxa_acerto: porcento(acertos, dele.length),
    };
  });

  // Respostas por dia
  const dias = {};
  for (const t of tentativas) {
    dias[t.dia] = dias[t.dia] || { dia: t.dia, total: 0, acertos: 0 };
    dias[t.dia].total++;
    if (t.acertou) dias[t.dia].acertos++;
  }

  const totalAcertos = tentativas.filter((t) => t.acertou).length;
  return {
    total_respostas: tentativas.length,
    taxa_acerto_geral: porcento(totalAcertos, tentativas.length),
    casos,
    por_dia: Object.values(dias).sort((a, b) => a.dia.localeCompare(b.dia)).slice(-14), // últimos 14 dias
  };
}

router.get('/estatisticas', rota(async (req, res) => {
  res.json(await calcularEstatisticas());
}));

// Mesma coisa em planilha (CSV), para o relatório acadêmico.
router.get('/estatisticas.csv', rota(async (req, res) => {
  const est = await calcularEstatisticas();
  const linhas = [['caso_id', 'titulo', 'tentativas', 'acertos', 'erros', 'taxa_acerto_pct']];
  for (const c of est.casos) {
    linhas.push([c.caso_id, `"${c.titulo.replace(/"/g, '""')}"`, c.tentativas, c.acertos, c.erros,
      c.taxa_acerto === null ? '' : String(c.taxa_acerto).replace('.', ',')]);
  }
  res.type('text/csv; charset=utf-8')
    .set('Content-Disposition', 'attachment; filename="conecta-resultados.csv"')
    .send('﻿' + linhas.map((l) => l.join(';')).join('\n'));
}));

// Alerta do Dia: troca a cada dia, em rodízio.
router.get('/alerta-do-dia', (req, res) => {
  const numeroDoDia = Math.floor(new Date(hoje()).getTime() / 86400000);
  res.json(alertas[numeroDoDia % alertas.length]);
});

router.get('/saude', (req, res) => res.json({ ok: true }));

module.exports = router;
