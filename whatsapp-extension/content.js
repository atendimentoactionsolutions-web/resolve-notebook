// Resolve Notebook - Injected WhatsApp Web Assistant
console.log('Resolve Notebook WhatsApp Assistant loaded on WhatsApp Web.');

const CONFIG = {
  address: "R. Santa Ifigênia, 361 - Lj 14 (Shopping 355), Santa Ifigênia, São Paulo - SP",
  mapsUrl: "https://share.google/LUfygV4B9Dst4atvz",
  phone: "(11) 98809-5982",
  openingHours: "Segunda a sexta das 9h às 18h | Sábado das 9h às 15h"
};

const SNIPPETS = [
  {
    icon: "📍",
    label: "Localização",
    text: `Estamos no coração da Santa Ifigênia! 📍\n\n🏢 *Endereço:* ${CONFIG.address}\n🕒 *Horário:* ${CONFIG.openingHours}\n🗺️ *Google Maps:* ${CONFIG.mapsUrl}\n\nPode vir direto na Loja 14 do Shopping 355!`
  },
  {
    icon: "🔬",
    label: "Em Análise",
    text: `Olá! Seu notebook já está na bancada técnica do nosso laboratório sendo avaliado pelos nossos especialistas. 🔬 Assim que concluirmos o diagnóstico, te envio o orçamento por aqui!`
  },
  {
    icon: "💰",
    label: "Orçamento",
    text: `*ORÇAMENTO TÉCNICO - RESOLVE NOTEBOOK* 🛠️\n\n💻 *Equipamento:* \n🔍 *Defeito:* \n⚙️ *Serviço/Peça:* \n💵 *Valor:* R$ \n⏳ *Prazo:* 24h a 48h úteis\n🛡️ *Garantia:* 90 dias com nota\n💳 *Pagamento:* PIX ou até 12x no cartão\n\nPodemos aprovar o reparo?`
  },
  {
    icon: "✅",
    label: "Pronto!",
    text: `🎉 *Ótima notícia! Seu notebook está PRONTO!* 💻✨\n\nO serviço foi concluído com sucesso e todos os testes foram aprovados.\n\n📍 *Retirada:* Shopping 355 • Loja 14\n🕒 *Horário:* Até às 18h\n\nJá pode vir retirar e testar na bancada!`
  },
  {
    icon: "⭐",
    label: "Pedir 5★",
    text: `Olá! Ficamos muito felizes em poder resolver o problema do seu notebook! 🚀🙏\n\nSe você gostou do nosso trabalho, poderia nos avaliar com 5 estrelas no Google? Nos ajuda muito:\n👉 *Link:* ${CONFIG.mapsUrl}\n\nMuito obrigado pela confiança!`
  },
  {
    icon: "⚡",
    label: "Upgrades",
    text: `*TABELA DE UPGRADES • RESOLVE NOTEBOOK* ⚡\n\n💾 *SSDs de Alta Velocidade:*\n• 256GB NVMe/SATA: R$ 180\n• 512GB NVMe/SATA: R$ 260\n• 1TB NVMe: R$ 420\n\n🧠 *Memória RAM:*\n• +8GB DDR4: R$ 140\n• +16GB DDR4: R$ 250\n\n✨ *Inclui instalação e limpeza preventiva interna.* Garantia de 1 ano!`
  }
];

function initAssistantWidget() {
  if (document.getElementById('resolve-wa-widget')) return;

  const widget = document.createElement('div');
  widget.id = 'resolve-wa-widget';
  widget.innerHTML = `
    <div id="resolve-wa-toggle" title="Assistente Resolve Notebook">
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#f59e0b" stroke-width="2.5">
        <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
        <line x1="12" y1="2" x2="12" y2="12" />
      </svg>
      <span>Resolve</span>
    </div>
    <div id="resolve-wa-panel" class="hidden">
      <div class="resolve-panel-header">
        <strong>Resolve Notebook</strong>
        <span class="resolve-panel-sub">Respostas Rápidas</span>
      </div>
      <div class="resolve-panel-items">
        ${SNIPPETS.map((s, idx) => `
          <button class="resolve-btn-snippet" data-index="${idx}">
            <span class="resolve-icon">${s.icon}</span>
            <span class="resolve-name">${s.label}</span>
          </button>
        `).join('')}
      </div>
    </div>
  `;

  document.body.appendChild(widget);

  const toggle = document.getElementById('resolve-wa-toggle');
  const panel = document.getElementById('resolve-wa-panel');

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    panel.classList.toggle('hidden');
  });

  document.addEventListener('click', (e) => {
    if (!widget.contains(e.target)) {
      panel.classList.add('hidden');
    }
  });

  widget.querySelectorAll('.resolve-btn-snippet').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-index'), 10);
      const text = SNIPPETS[idx].text;
      insertTextIntoWhatsApp(text);
      panel.classList.add('hidden');
    });
  });
}

function insertTextIntoWhatsApp(text) {
  // Find WhatsApp Web input box
  const inputBox = document.querySelector('footer div[contenteditable="true"]') || 
                   document.querySelector('div[contenteditable="true"][data-tab="10"]') ||
                   document.querySelector('div[contenteditable="true"]');

  if (inputBox) {
    inputBox.focus();
    // Use document.execCommand to trigger WhatsApp internal draft events
    const success = document.execCommand('insertText', false, text);
    if (!success) {
      inputBox.textContent = text;
      inputBox.dispatchEvent(new InputEvent('input', { bubbles: true }));
    }
    showInjectedToast('Mensagem inserida!');
  } else {
    // Fallback: Copy to clipboard
    navigator.clipboard.writeText(text).then(() => {
      showInjectedToast('Copiado! Pressione Ctrl+V no campo de mensagem.');
    });
  }
}

function showInjectedToast(msg) {
  let toast = document.getElementById('resolve-injected-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'resolve-injected-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2200);
}

// Ensure injection after WhatsApp Web loads
setTimeout(initAssistantWidget, 2500);
setInterval(() => {
  if (!document.getElementById('resolve-wa-widget')) {
    initAssistantWidget();
  }
}, 3000);
