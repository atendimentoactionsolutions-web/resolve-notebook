const unsure = 'Não sei informar';
const question = (id, label, options) => ({ id, label, options: [...options, unsure] });
const since = question('since', 'Há quanto tempo você percebeu o problema?', ['Hoje', 'Há alguns dias', 'Há algumas semanas', 'Há mais de um mês']);

const profiles = {
  power: [
    question('power-signal', 'O que acontece ao apertar o botão de ligar?', ['Não dá nenhum sinal', 'Acende luz, mas não liga', 'Liga e desliga em seguida', 'Liga, mas não carrega a bateria']),
    question('charger', 'Como está o carregador?', ['É o original e está conectado', 'Uso outro carregador compatível', 'Está danificado ou com mau contato', 'Não tenho carregador'])
  ],
  screen: [
    question('screen-symptom', 'Como está a tela?', ['Quebrada ou trincada', 'Preta, mas o notebook liga', 'Com linhas, manchas ou piscando', 'Com imagem muito escura']),
    question('screen-cause', 'O problema começou depois de algum acontecimento?', ['Queda ou impacto', 'Abrir ou fechar a tampa', 'Sem motivo aparente'])
  ],
  performance: [
    question('performance-symptom', 'Qual sintoma você percebe mais?', ['Demora para iniciar ou abrir programas', 'Trava durante o uso', 'Esquenta muito ou faz barulho', 'Desliga ou reinicia sozinho']),
    question('performance-use', 'Quando isso costuma acontecer?', ['Logo ao ligar', 'Durante tarefas simples', 'Em jogos ou programas pesados', 'Depois de algum tempo de uso'])
  ],
  structure: [
    question('structure-part', 'Qual parte está danificada?', ['Dobradiça', 'Tampa da tela', 'Base ou carcaça', 'Mais de uma parte']),
    question('structure-movement', 'Como está o movimento da tampa?', ['Abre e fecha normalmente', 'Está dura, torta ou solta', 'Não abre ou não fecha'])
  ],
  battery: [
    question('battery-symptom', 'O que acontece com a bateria?', ['Dura pouco tempo', 'Só funciona conectado à tomada', 'Não carrega ou para de carregar', 'Está estufada']),
    question('battery-duration', 'Quanto tempo dura fora da tomada?', ['Menos de 30 minutos', 'Entre 30 minutos e 1 hora', 'Mais de 1 hora', 'Desliga ao tirar da tomada'])
  ],
  keyboard: [
    question('keyboard-symptom', 'Onde você percebe a falha?', ['Algumas teclas', 'Teclado inteiro', 'Touchpad', 'Sistema ou programas']),
    question('keyboard-behavior', 'Como a falha aparece?', ['Não responde', 'Digita ou clica sozinho', 'Funciona às vezes', 'Mostra mensagem de erro'])
  ],
  liquid: [
    question('liquid-type', 'Qual líquido entrou em contato com o notebook?', ['Água', 'Café ou chá', 'Refrigerante ou outra bebida', 'Outro líquido']),
    question('liquid-time', 'Quando aconteceu o contato com o líquido?', ['Nas últimas horas', 'Hoje', 'Há alguns dias', 'Há mais de uma semana']),
    question('liquid-after', 'O notebook foi ligado depois do ocorrido?', ['Não foi ligado', 'Foi ligado e funcionou', 'Foi ligado, mas apresentou falha'])
  ],
  general: [
    question('general-symptom', 'Como o problema aparece?', ['O notebook não funciona', 'Funciona com falhas', 'Quero manutenção ou upgrade']),
    question('general-frequency', 'Com que frequência acontece?', ['Sempre', 'Às vezes', 'Foi uma única vez'])
  ]
};

export function getRepairQuestions(issue = '') {
  const text = issue.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  let profile = 'general';
  if (/liquido|desoxid|oxidacao/.test(text)) profile = 'liquid';
  else if (/tela|imagem|flat|monitor/.test(text)) profile = 'screen';
  else if (/carcaca|dobradica|estrutura/.test(text)) profile = 'structure';
  else if (/bateria|autonomia/.test(text)) profile = 'battery';
  else if (/nao liga|nao carrega|alimentacao|carregador|carga/.test(text)) profile = 'power';
  else if (/lento|lentidao|trav|esquenta|aquec|limpeza|termic|cooler|refrigeracao|ssd|memoria/.test(text)) profile = 'performance';
  else if (/teclado|touchpad|sistema|software/.test(text)) profile = 'keyboard';
  return profile === 'liquid' ? profiles[profile] : [...profiles[profile], since];
}

export function buildRepairMessage({ issue, brand, model = '', notes = '', answers = {} }) {
  const lines = ['Olá! Vim pelo site da RESOLVE Notebook.', '', `Problema: ${issue || 'Avaliação geral'}.`];
  if (brand) lines.push(`Marca: ${brand}.`);
  if (model.trim()) lines.push(`Modelo: ${model.trim()}.`);
  for (const question of getRepairQuestions(issue)) {
    const answer = answers[question.id];
    if (question.options.includes(answer)) lines.push(`${question.label} ${answer}.`);
  }
  if (notes.trim()) lines.push(`Detalhes: ${notes.trim()}`);
  lines.push('', 'Gostaria de conversar com um técnico sobre a avaliação do equipamento.');
  return lines.join('\n');
}
