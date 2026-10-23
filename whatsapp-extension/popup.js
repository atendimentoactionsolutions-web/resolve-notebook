// Resolve Notebook - WhatsApp Assistant Extension
const CONFIG = {
  address: "R. Santa Ifigênia, 361 - Lj 14 (Shopping 355), Santa Ifigênia, São Paulo - SP",
  mapsUrl: "https://share.google/LUfygV4B9Dst4atvz",
  instagram: "@resolve.notebook",
  phone: "(11) 98809-5982",
  openingHours: "Segunda a sexta das 9h às 18h | Sábado das 9h às 15h"
};

// Quick replies dataset
const QUICK_REPLIES = [
  {
    id: "boas-vindas",
    tag: "Recepção",
    title: "👋 Boas-vindas & Atendimento",
    text: `Olá! Seja muito bem-vindo à *Resolve Notebook*! 💻⚡\n\nSou técnico aqui na loja da Santa Ifigênia. Como posso te ajudar hoje com o seu equipamento?`
  },
  {
    id: "localizacao",
    tag: "Loja Física",
    title: "📍 Endereço & Localização (Maps)",
    text: `Estamos localizados no coração da Santa Ifigênia! 📍\n\n🏢 *Endereço:* ${CONFIG.address}\n🕒 *Horário:* ${CONFIG.openingHours}\n🗺️ *Google Maps (Rota):* ${CONFIG.mapsUrl}\n\nFicamos bem pertinho das estações Luz e São Bento do metrô. Pode vir direto na Loja 14!`
  },
  {
    id: "em-analise",
    tag: "Bancada",
    title: "🔍 Aparelho na Bancada em Análise",
    text: `Olá! Passando para avisar que seu notebook já está na bancada técnica do nosso laboratório sendo avaliado pelos nossos especialistas. 🔬\n\nAssim que concluirmos todos os testes dos circuitos e componentes, te envio o diagnóstico detalhado por aqui!`
  },
  {
    id: "orcamento",
    tag: "Valores",
    title: "💰 Modelo de Envio de Orçamento",
    text: `*ORÇAMENTO TÉCNICO - RESOLVE NOTEBOOK* 🛠️\n\n💻 *Equipamento:* [Modelo]\n🔍 *Diagnóstico:* [Defeito identificado]\n⚙️ *Serviço/Peça:* [Ex: Troca de tela / Reparo de placa]\n💵 *Valor Total:* R$ [Valor]\n⏳ *Prazo estimado:* [Ex: 24h a 48h úteis]\n🛡️ *Garantia:* 90 dias com nota e termo\n💳 *Pagamento:* PIX, Dinheiro ou Cartão até 12x\n\nPodemos dar início ao reparo?`
  },
  {
    id: "pronto",
    tag: "Retirada",
    title: "✅ Aparelho Pronto para Retirada",
    text: `🎉 *Ótima notícia! Seu notebook está PRONTO!* 💻✨\n\nO serviço foi concluído com sucesso e o equipamento passou em todos os nossos testes de estresse, temperatura e estabilidade.\n\n📍 *Local de Retirada:* Shopping 355 • Loja 14\n🕒 *Horário de Atendimento:* Até às 18h\n\nJá pode passar para retirar e testar na bancada!`
  },
  {
    id: "avaliacao-google",
    tag: "Avaliação",
    title: "⭐ Pedido de 5 Estrelas no Google",
    text: `Olá! Ficamos muito felizes em poder resolver o problema do seu notebook! 🚀🙏\n\nNosso objetivo é sempre entregar o melhor atendimento da Santa Ifigênia. Se você gostou do nosso trabalho, poderia deixar uma avaliação 5 estrelas no nosso Google? Leva menos de 30 segundos e nos ajuda muito:\n\n👉 *Avalie aqui:* ${CONFIG.mapsUrl}\n\nMuito obrigado pela confiança!`
  },
  {
    id: "tabela-upgrades",
    tag: "Upgrade",
    title: "🚀 Tabela de Upgrade SSD & RAM",
    text: `Turbine seu notebook e deixe ele até 10x mais rápido! ⚡\n\n💾 *Upgrades de SSD de Alta Velocidade:*\n• SSD 256GB NVMe/SATA: R$ 180\n• SSD 512GB NVMe/SATA: R$ 260\n• SSD 1TB NVMe Pro: R$ 420\n\n⚡ *Expansão de Memória RAM:*\n• +8GB DDR4: R$ 140\n• +16GB DDR4: R$ 250\n\n✨ *Inclui instalação, clonagem/formatação limpa e limpeza preventiva interna.* Garantia de 1 ano!`
  }
];

document.addEventListener('DOMContentLoaded', () => {
  // Tabs Navigation
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      const target = document.getElementById(btn.getAttribute('data-tab'));
      if (target) target.classList.add('active');
    });
  });

  // Render Replies
  const repliesContainer = document.getElementById('replies-container');
  const filterInput = document.getElementById('filter-replies');

  function renderReplies(filter = '') {
    repliesContainer.innerHTML = '';
    const cleanFilter = filter.toLowerCase().trim();

    const filtered = QUICK_REPLIES.filter(r => 
      r.title.toLowerCase().includes(cleanFilter) || 
      r.tag.toLowerCase().includes(cleanFilter) || 
      r.text.toLowerCase().includes(cleanFilter)
    );

    if (filtered.length === 0) {
      repliesContainer.innerHTML = '<div style="text-align:center;color:#6b7280;padding:20px;font-size:11px;">Nenhuma resposta encontrada.</div>';
      return;
    }

    filtered.forEach(reply => {
      const item = document.createElement('div');
      item.className = 'reply-item';
      item.innerHTML = `
        <div class="reply-header">
          <span class="reply-title">${reply.title}</span>
          <span class="reply-tag">${reply.tag}</span>
        </div>
        <div class="reply-preview">${reply.text}</div>
        <div class="reply-actions">
          <button class="btn-small btn-copy" data-text="${encodeURIComponent(reply.text)}">📋 Copiar</button>
          <button class="btn-small btn-small-wa btn-send-wa" data-text="${encodeURIComponent(reply.text)}">💬 Usar no Whats</button>
        </div>
      `;
      repliesContainer.appendChild(item);
    });

    // Attach copy actions
    repliesContainer.querySelectorAll('.btn-copy').forEach(b => {
      b.addEventListener('click', () => {
        const text = decodeURIComponent(b.getAttribute('data-text'));
        copyToClipboard(text);
      });
    });

    // Attach send to direct action
    repliesContainer.querySelectorAll('.btn-send-wa').forEach(b => {
      b.addEventListener('click', () => {
        const text = decodeURIComponent(b.getAttribute('data-text'));
        document.getElementById('direct-msg').value = text;
        // switch to tab-direct
        tabBtns[0].click();
        document.getElementById('direct-phone').focus();
        showToast('Mensagem carregada! Insira o telefone.');
      });
    });
  }

  renderReplies();

  if (filterInput) {
    filterInput.addEventListener('input', (e) => {
      renderReplies(e.target.value);
    });
  }

  // Quick Chips in Direct Tab
  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const msg = chip.getAttribute('data-msg');
      document.getElementById('direct-msg').value = msg;
    });
  });

  // Open Direct WhatsApp
  document.getElementById('btn-open-wa').addEventListener('click', () => {
    let phone = document.getElementById('direct-phone').value.replace(/\D/g, '');
    const msg = document.getElementById('direct-msg').value;

    if (!phone) {
      alert('Por favor, informe o telefone com DDD (ex: 11999998888)');
      document.getElementById('direct-phone').focus();
      return;
    }

    // Add country code 55 if missing
    if (phone.length <= 11) {
      phone = '55' + phone;
    }

    const waUrl = `https://web.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
  });

  // Generate OS
  document.getElementById('btn-generate-os').addEventListener('click', () => {
    const name = document.getElementById('os-name').value.trim() || 'Cliente';
    const model = document.getElementById('os-model').value.trim() || 'Notebook';
    const accessories = document.getElementById('os-accessories').value;
    const issue = document.getElementById('os-issue').value.trim() || 'Avaliação / Diagnóstico';
    const password = document.getElementById('os-password').value.trim() || 'Não informada';
    const osNumber = 'OS-' + Math.floor(1000 + Math.random() * 9000);
    const date = new Date().toLocaleDateString('pt-BR');

    const osText = `*COMPROVANTE DE ENTRADA • RESOLVE NOTEBOOK*\n` +
      `---------------------------------------------\n` +
      `📑 *Protocolo:* ${osNumber} | 📅 *Data:* ${date}\n` +
      `👤 *Cliente:* ${name}\n` +
      `💻 *Equipamento:* ${model}\n` +
      `🔌 *Itens deixados:* ${accessories}\n` +
      `🔐 *Senha Windows:* ${password}\n` +
      `🛠️ *Defeito Relatado:* ${issue}\n` +
      `---------------------------------------------\n` +
      `📍 *Local:* Shopping 355 • Loja 14 • Santa Ifigênia\n` +
      `📞 *WhatsApp:* ${CONFIG.phone}\n` +
      `⚠️ *Aviso:* O prazo médio de análise é de 24 a 48h. Enviaremos o orçamento por aqui!`;

    copyToClipboard(osText);
    showToast('Comprovante de OS copiado! Cole no WhatsApp.');
  });

  // Upgrade Calculator
  const calcSSD = document.getElementById('calc-ssd');
  const calcRAM = document.getElementById('calc-ram');
  const calcService = document.getElementById('calc-service');
  const calcTotalPrice = document.getElementById('calc-total-price');

  function updateCalc() {
    const ssd = parseFloat(calcSSD.value) || 0;
    const ram = parseFloat(calcRAM.value) || 0;
    const service = parseFloat(calcService.value) || 0;
    const total = ssd + ram + service;
    calcTotalPrice.textContent = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  calcSSD.addEventListener('change', updateCalc);
  calcRAM.addEventListener('change', updateCalc);
  calcService.addEventListener('change', updateCalc);

  document.getElementById('btn-copy-calc').addEventListener('click', () => {
    const ssdText = calcSSD.options[calcSSD.selectedIndex].text;
    const ramText = calcRAM.options[calcRAM.selectedIndex].text;
    const serviceText = calcService.options[calcService.selectedIndex].text;
    const total = calcTotalPrice.textContent;

    const budgetText = `*PROPOSTA DE UPGRADE • RESOLVE NOTEBOOK* ⚡\n\n` +
      `💾 *Armazenamento:* ${ssdText}\n` +
      `🧠 *Memória RAM:* ${ramText}\n` +
      `🔧 *Serviço:* ${serviceText}\n\n` +
      `💰 *VALOR TOTAL:* ${total}\n` +
      `🛡️ *Garantia:* 1 ano nas peças instaladas\n` +
      `💳 *Formas de pagamento:* PIX ou até 12x no cartão\n\n` +
      `Seu notebook vai voar de rápido! Gostaria de agendar para hoje?`;

    copyToClipboard(budgetText);
    showToast('Orçamento de upgrade copiado!');
  });

  // Helper copy function
  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      showToast('Copiado para a área de transferência!');
    }).catch(() => {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showToast('Copiado para a área de transferência!');
    });
  }

  function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }
});
