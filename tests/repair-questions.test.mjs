import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getRepairQuestions, buildRepairMessage } from '../src/data/repairQuestions.js';
import { getPublishedReviews } from '../src/data/customerReviews.js';

test('orçamento apresenta perguntas específicas para cada problema e procedimento', () => {
  const cases = [
    ['Não liga ou não carrega', 'power-signal'],
    ['Tela quebrada ou sem imagem', 'screen-symptom'],
    ['Lento, travando ou esquentando', 'performance-symptom'],
    ['Carcaça ou dobradiça quebrada', 'structure-part'],
    ['Bateria dura pouco', 'battery-symptom'],
    ['Teclado ou sistema com falhas', 'keyboard-symptom'],
    ['Contato com líquido', 'liquid-type'],
    ['Outro problema', 'general-symptom'],
    ['Desoxidação e reparo após contato com líquidos.', 'liquid-type'],
    ['Substituição de pasta térmica.', 'performance-symptom'],
    ['Troca de tela.', 'screen-symptom']
  ];
  for (const [issue, expected] of cases) {
    const questions = getRepairQuestions(issue);
    assert.equal(questions[0].id, expected, issue);
    assert.equal(new Set(questions.map(q => q.id)).size, questions.length);
  }
});

test('mensagem leva as respostas atuais, preserva acentos e ignora respostas de outro problema', () => {
  const message = buildRepairMessage({
    issue: 'Bateria dura pouco', brand: 'Dell', model: ' Inspiron 15 ', notes: ' Desliga fora da tomada. ',
    answers: { 'battery-symptom': 'Só funciona conectado à tomada', 'screen-symptom': 'Quebrada ou trincada', since: 'Hoje' }
  });
  assert.match(message, /Marca: Dell/);
  assert.match(message, /Modelo: Inspiron 15/);
  assert.match(message, /Só funciona conectado à tomada/);
  assert.match(message, /Hoje/);
  assert.match(message, /Detalhes: Desliga fora da tomada/);
  assert.doesNotMatch(message, /Quebrada ou trincada/);
  assert.equal(new URL(`https://wa.me/5511988095982?text=${encodeURIComponent(message)}`).searchParams.get('text'), message);
});

test('depoimentos sem original conferido e autorização não aparecem no site', () => {
  const review = { author: 'Cliente', excerpt: 'Comentário', reviewUrl: 'https://www.google.com/maps/reviews/example' };
  assert.equal(getPublishedReviews().length, 3);
  assert.deepEqual(getPublishedReviews([{ ...review, authorized: true }]), []);
  assert.deepEqual(getPublishedReviews([{ ...review, originalVerified: true }]), []);
  assert.equal(getPublishedReviews([{ ...review, authorized: true, originalVerified: true }]).length, 1);
});
