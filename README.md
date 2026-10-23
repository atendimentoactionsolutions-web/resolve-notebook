# Resolve Notebook - Site Oficial & Landing Page

Site moderno e responsivo desenvolvido com **React + Tailwind CSS + Lucide Icons** baseado no design exclusivo Dark Tech & Gold para a **Resolve Notebook** (Assistência Técnica Especializada na Santa Ifigênia, São Paulo - SP).

---

## 🚀 Como Executar Localmente

O servidor de desenvolvimento já está configurado. Para iniciar a qualquer momento:

```bash
npm run dev
```

Acesse no navegador:
👉 **http://localhost:5173**

---

## 📦 Como Gerar a Versão Final para Publicação (Deploy)

Para gerar os arquivos estáticos otimizados prontos para hospedagem (Vercel, Netlify, Hostgator, cPanel, etc.):

```bash
npm run build
```

Os arquivos prontos ficarão na pasta `dist/`.

---

## ⚙️ Como Alterar WhatsApp, Instagram ou Textos

Todos os dados principais de contato estão centralizados no arquivo:
📁 [`src/data/siteConfig.js`](src/data/siteConfig.js)

Nele você pode alterar com facilidade:
- **Número do WhatsApp:** (usado nos botões e no modal)
- **Instagram:** `@resolve.notebook`
- **Endereço da Loja:** Rua Santa Ifigênia, 383 - Loja 08
- **Horário de Atendimento**
- **Lista de Serviços e Produtos**

---

## ✨ Recursos Implementados

1. **Header Fixo (Glassmorphism):** Logo estilizada, links de navegação suaves e botão de WhatsApp com efeito de destaque.
2. **Hero Section:** Headline de alto impacto, badges de confiança e visualização tecnológica com o slogan *"Tecnologia que te move"*.
3. **9 Cards de Serviços:** Limpeza, Formatação, Upgrade SSD/RAM, Troca de Tela, Teclado, Bateria, Placa-Mãe, Lentidão e Backup.
4. **Produtos em Destaque:** Notebooks, SSDs, Memória RAM e Acessórios com botões que abrem mensagens específicas no WhatsApp.
5. **Banners de Compra e Venda:** Seções *"Quer comprar um notebook?"* e *"Quer vender seu notebook?"*.
6. **B2B / Corporativo:** Soluções de TI com diferenciais para empresas.
7. **Sobre a Loja:** Localização e tradição na Santa Ifigênia.
8. **Depoimentos Reais:** 3 avaliações 5 estrelas.
9. **Modal Interativo de Orçamento:** Formulário rápido que coleta dados do notebook e envia direto no WhatsApp do técnico.
10. **Botão Flutuante do WhatsApp:** Com indicador de online e aviso chamativo.
