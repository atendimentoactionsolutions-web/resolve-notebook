(() => {
  'use strict';
  const whatsapp = 'https://wa.me/5511988095982';
  const wa = message => `${whatsapp}?text=${encodeURIComponent(message)}`;
  document.querySelectorAll('[data-wa]').forEach(link => { link.href = wa(link.dataset.wa); });

  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#main-nav');
  const closeMenu = () => { menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Abrir menu'); nav.classList.remove('is-open'); };
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    nav.classList.toggle('is-open', open);
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  const repair = document.querySelector('#repair-dialog');
  const services = document.querySelector('#services-dialog');
  const stepOne = document.querySelector('#repair-step-one');
  const stepTwo = document.querySelector('#repair-step-two');
  const issueNames = [
    'Não liga ou não carrega', 'Tela quebrada ou sem imagem',
    'Lento, travando ou esquentando', 'Carcaça ou dobradiça quebrada',
    'Bateria dura pouco', 'Teclado ou sistema com falhas',
    'Contato com líquido', 'Outro problema'
  ];
  let selectedIssue = '';
  const arrow = '<svg aria-hidden="true"><use href="#arrow"/></svg>';
  const lock = () => document.body.classList.toggle('modal-open', !!document.querySelector('dialog[open]'));
  const show = dialog => { closeMenu(); dialog.showModal(); lock(); };
  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', lock);
    dialog.addEventListener('click', e => {
      if (e.target !== dialog) return;
      const r = dialog.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close();
    });
  });
  const updateMessage = () => {
    const values = new FormData(stepTwo);
    let message = `Olá! Vim pelo site da RESOLVE Notebook.\n\nProblema: ${selectedIssue}.`;
    if (values.get('brand')) message += `\nMarca: ${values.get('brand')}.`;
    if (String(values.get('model') || '').trim()) message += `\nModelo: ${String(values.get('model')).trim()}.`;
    if (String(values.get('notes') || '').trim()) message += `\nDetalhes: ${String(values.get('notes')).trim()}`;
    message += '\n\nGostaria de conversar com um técnico sobre a avaliação do equipamento.';
    document.querySelector('#repair-whatsapp').href = wa(message);
  };
  const setStep = (issue = '') => {
    selectedIssue = issue;
    stepOne.hidden = !!issue;
    stepTwo.hidden = !issue;
    document.querySelector('#step-label').textContent = issue ? 'Etapa 2 de 2 · Seu notebook' : 'Etapa 1 de 2 · Seu problema';
    document.querySelector('.selected-issue').textContent = issue;
    updateMessage();
    repair.scrollTop = 0;
  };
  const openRepair = issue => { setStep(issue || ''); show(repair); };
  issueNames.forEach(issue => {
    const button = document.createElement('button'); button.type = 'button';
    button.innerHTML = `<span>${issue}</span>${arrow}`;
    button.addEventListener('click', () => { setStep(issue); stepTwo.querySelector('select').focus(); });
    document.querySelector('.issue-options').appendChild(button);
  });
  document.querySelectorAll('[data-repair]').forEach(button => button.addEventListener('click', () => openRepair('')));
  document.querySelectorAll('[data-issue]').forEach(button => button.addEventListener('click', () => openRepair(button.dataset.issue)));
  document.querySelector('.back-button').addEventListener('click', () => { setStep(); document.querySelector('.issue-options button').focus(); });
  stepTwo.addEventListener('input', updateMessage);
  stepTwo.addEventListener('change', updateMessage);
  stepTwo.addEventListener('submit', e => e.preventDefault());
  document.querySelector('#repair-whatsapp').addEventListener('click', e => {
    if (!stepTwo.reportValidity()) { e.preventDefault(); return; }
    updateMessage();
  });

  const serviceData = [
    ['Placa-mãe e eletrônica', 'Diagnóstico e reparo de falhas que impedem o funcionamento.', 'Não liga ou não carrega'],
    ['Tela e cabo flat', 'Troca de tela e correção de falhas de imagem.', 'Tela quebrada ou sem imagem'],
    ['Carcaça e dobradiças', 'Recuperação de fixações, bases e estrutura.', 'Carcaça ou dobradiça quebrada'],
    ['Limpeza e pasta térmica', 'Manutenção preventiva e cuidado com o superaquecimento.', 'Lento, travando ou esquentando'],
    ['Cooler e refrigeração', 'Ventilação, ruídos e controle de temperatura.', 'Lento, travando ou esquentando'],
    ['SSD e memória RAM', 'Mais capacidade e agilidade para a sua rotina.', 'Upgrade de SSD e memória'],
    ['Bateria e conector de carga', 'Autonomia, carregamento e conectores.', 'Bateria dura pouco'],
    ['Teclado e touchpad', 'Teclas com falhas, teclado e navegação.', 'Teclado ou sistema com falhas'],
    ['Windows e macOS', 'Reinstalação e configuração do sistema.', 'Teclado ou sistema com falhas'],
    ['Desoxidação por líquidos', 'Avaliação de equipamentos que tiveram contato com líquidos.', 'Contato com líquido'],
    ['Backup e recuperação de dados', 'Avaliação e orientação para acesso aos seus arquivos.', 'Backup e recuperação de dados']
  ];
  const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const renderServices = (search = '') => {
    const list = document.querySelector('#all-services-list'); list.replaceChildren();
    const matches = serviceData.filter(row => normalize(row.join(' ')).includes(normalize(search)));
    matches.forEach(([name, desc, issue]) => {
      const button = document.createElement('button'); button.type = 'button';
      button.innerHTML = `<span><strong>${name}</strong><small>${desc}</small></span>${arrow}`;
      button.addEventListener('click', () => { services.close(); openRepair(issue); });
      list.appendChild(button);
    });
    if (!matches.length) { const p = document.createElement('p'); p.className = 'no-result'; p.textContent = 'Não encontrou? Tente outro termo ou fale com a nossa equipe pelo WhatsApp.'; list.appendChild(p); }
  };
  renderServices();
  document.querySelector('[data-all-services]').addEventListener('click', () => { document.querySelector('#service-search').value = ''; renderServices(); show(services); });
  document.querySelector('#service-search').addEventListener('input', e => renderServices(e.target.value));

  const useContent = {
    Trabalho: ['Um parceiro para<br>o dia render.', 'Reuniões, planilhas, projetos e muitas abas abertas. Encontre a configuração que acompanha a sua rotina.'],
    Estudo: ['Foco no que<br>você quer aprender.', 'Aulas, pesquisas, trabalhos e novos projetos. Conte seu curso e sua rotina para encontrar um notebook que faz sentido para você.'],
    Gamer: ['Desempenho para<br>o seu próximo nível.', 'Conte quais jogos ou programas você usa. A equipe ajuda a comparar configurações e consultar os modelos disponíveis.'],
    MacBook: ['Seu próximo Mac.<br>Escolhido com cuidado.', 'Conheça as opções de MacBook revisados. Nossa equipe orienta a escolha de acordo com o seu uso e os modelos disponíveis.']
  };
  const usageTabs = Array.from(document.querySelectorAll('[data-usage]'));
  const setUsage = button => {
    const usage = button.dataset.usage;
    usageTabs.forEach(tab => { const active = tab === button; tab.setAttribute('aria-selected', String(active)); tab.tabIndex = active ? 0 : -1; });
    const panel = document.querySelector('#usage-panel'); panel.setAttribute('aria-labelledby', button.id);
    panel.querySelector('h3').innerHTML = useContent[usage][0];
    const pageUrl = new URL(window.location.href);
    pageUrl.searchParams.set('perfil', usage.toLowerCase());
    history.replaceState(null, '', pageUrl.pathname + pageUrl.search + pageUrl.hash);
    panel.querySelector('p').textContent = useContent[usage][1];
    panel.querySelector('a').href = '/produtos?perfil=' + encodeURIComponent(usage.toLowerCase());
  };
  usageTabs.forEach((button, index) => {
    button.addEventListener('click', () => setUsage(button));
    button.addEventListener('keydown', e => {
      let next;
      if (e.key === 'ArrowRight') next = (index + 1) % usageTabs.length;
      if (e.key === 'ArrowLeft') next = (index - 1 + usageTabs.length) % usageTabs.length;
      if (e.key === 'Home') next = 0;
      if (e.key === 'End') next = usageTabs.length - 1;
      if (next !== undefined) { e.preventDefault(); setUsage(usageTabs[next]); usageTabs[next].focus(); }
    });
  });
  const initialProfile = new URLSearchParams(location.search).get('perfil');
  setUsage(usageTabs.find(tab => tab.dataset.usage.toLowerCase() === initialProfile) || usageTabs[0]);
  document.querySelectorAll('.faq details').forEach(detail => detail.addEventListener('toggle', () => {
    if (detail.open) document.querySelectorAll('.faq details').forEach(other => { if (other !== detail) other.open = false; });
  }));
})();
