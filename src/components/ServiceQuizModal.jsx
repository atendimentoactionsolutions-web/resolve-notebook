import React, { useState, useEffect, useRef } from 'react';
import { getRepairQuestions, buildRepairMessage } from '../data/repairQuestions';

const issues = [
  'Não liga ou não carrega',
  'Tela quebrada ou sem imagem',
  'Lento, travando ou esquentando',
  'Carcaça ou dobradiça quebrada',
  'Bateria dura pouco',
  'Teclado ou sistema com falhas',
  'Contato com líquido',
  'Outro problema'
];

const BRANDS = [
  'Dell',
  'Lenovo',
  'Asus',
  'Acer',
  'HP',
  'Samsung',
  'Apple / MacBook',
  'Avell',
  'Positivo / Vaio',
  'Outra / não sei'
];

export default function ServiceQuizModal({ isOpen, onClose, initialIssue = '', openerRef }) {
  const isDark = typeof document !== 'undefined' && document.body.classList.contains('dark-mode');
  const [step, setStep] = useState(0);
  const [issue, setIssue] = useState('');
  const [customIssueText, setCustomIssueText] = useState('');
  const [isCustomSelected, setIsCustomSelected] = useState(false);
  const [answers, setAnswers] = useState({});
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [confirmedProtocol, setConfirmedProtocol] = useState(null);
  const [sentToWhatsApp, setSentToWhatsApp] = useState(false);
  const [idempotencyKey, setIdempotencyKey] = useState('');

  const dialogRef = useRef(null);
  const headingRef = useRef(null);

  // Inicializa o modal ao abrir
  useEffect(() => {
    if (isOpen) {
      setIdempotencyKey(crypto?.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()));
      setConfirmedProtocol(null);
      setSentToWhatsApp(false);
      setSubmitError('');
      if (initialIssue) {
        if (initialIssue === 'Outro problema') {
          setIsCustomSelected(true);
          setIssue('Outro problema');
          setCustomIssueText('');
        } else {
          setIssue(initialIssue);
          setIsCustomSelected(false);
        }
        setStep(0);
      } else {
        setStep(0);
        setIssue('');
        setIsCustomSelected(false);
        setCustomIssueText('');
      }
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [isOpen, initialIssue]);

  // Gerenciamento de foco e tecla ESC
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    headingRef.current?.focus();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, step, confirmedProtocol, sentToWhatsApp]);

  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
    if (openerRef?.current) {
      openerRef.current.focus();
    }
  };

  const questions = getRepairQuestions(issue);
  const totalSteps = 1 + questions.length + 1;
  const isFinalStep = step === questions.length + 1;
  const currentQuestion = step > 0 && step <= questions.length ? questions[step - 1] : null;

  const goToStep = (nextStep) => {
    setStep(nextStep);
    setSubmitError('');
    requestAnimationFrame(() => headingRef.current?.focus());
  };

  const handleFormatPhone = (val) => {
    let raw = val.replace(/\D/g, '');
    if (raw.startsWith('55') && (raw.length === 12 || raw.length === 13)) {
      raw = raw.slice(2);
    }
    raw = raw.slice(0, 11);
    if (raw.length <= 2) return raw;
    if (raw.length <= 6) return `(${raw.slice(0, 2)}) ${raw.slice(2)}`;
    if (raw.length <= 10) return `(${raw.slice(0, 2)}) ${raw.slice(2, 6)}-${raw.slice(6)}`;
    return `(${raw.slice(0, 2)}) ${raw.slice(2, 7)}-${raw.slice(7)}`;
  };

  // Envio Direto e Profissional no WhatsApp
  const handleSendDirectWhatsApp = () => {
    const finalProblem = isCustomSelected 
      ? (customIssueText.trim() || 'Outro problema a relatar')
      : (issue || customIssueText.trim() || 'Avaliação e reparo de notebook');

    const message = buildRepairMessage({
      issue: finalProblem,
      customDescription: isCustomSelected ? customIssueText.trim() : '',
      brand: brand || '',
      model: model ? model.trim() : '',
      notes: notes ? notes.trim() : '',
      name: name ? name.trim() : '',
      answers
    });

    // Registra silenciosamente no backend para controle interno
    try {
      fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idempotencyKey,
          name: name ? name.trim() : 'Cliente via Site',
          phone: phone || '(11) 98809-5982',
          brand: brand || '',
          model: model.trim(),
          issue: finalProblem,
          notes: notes.trim()
        })
      }).then(r => r.json()).then(data => {
        if (data && data.protocol) setConfirmedProtocol(data.protocol);
      }).catch(() => {});
    } catch (_) {}

    const whatsappUrl = `https://wa.me/5511988095982?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setSentToWhatsApp(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!name.trim()) {
      setSubmitError('Por favor, informe seu nome.');
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setSubmitError('Informe um número de WhatsApp válido com DDD (mínimo 10 dígitos).');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    const finalProblem = isCustomSelected ? (customIssueText.trim() || 'Outro problema') : issue;

    const payload = {
      idempotencyKey,
      name: name.trim(),
      phone,
      brand,
      model: model.trim(),
      issue: finalProblem,
      answers,
      notes: notes.trim()
    };

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.protocol) {
        setConfirmedProtocol(data.protocol);
      } else {
        setSubmitError(data.error || 'Não foi possível registrar a avaliação. Verifique os dados e tente novamente.');
      }
    } catch (err) {
      setSubmitError('Erro de conexão ao enviar a avaliação. Seus dados estão salvos, tente enviar novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="quiz-modal-overlay" 
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="quiz-modal-title"
    >
      <div className="quiz-modal-panel" ref={dialogRef} style={{ maxWidth: '580px' }}>
        {/* Cabeçalho do Modal */}
        <div className="quiz-modal-header">
          <div>
            {!confirmedProtocol && !sentToWhatsApp && step === 0 && (
              <p className="eyebrow" aria-live="polite">
                Resolve Notebook · Santa Ifigênia
              </p>
            )}
            {!confirmedProtocol && !sentToWhatsApp && step > 0 && (
              <p className="eyebrow" aria-live="polite">
                Etapa {step + 1} de {totalSteps} · Diagnóstico
              </p>
            )}
            <h2 id="quiz-modal-title" ref={headingRef} tabIndex={-1} className="quiz-modal-title">
              {sentToWhatsApp
                ? 'Solicitação Enviada ao WhatsApp!'
                : confirmedProtocol 
                  ? 'Solicitação Confirmada!' 
                  : step === 0 
                    ? 'Qual problema você percebeu?' 
                    : isFinalStep 
                      ? 'Para finalizar, dados do seu notebook e contato' 
                      : currentQuestion?.label}
            </h2>
          </div>
          <button 
            type="button" 
            className="dialog-close quiz-close-btn" 
            onClick={handleClose} 
            aria-label="Fechar formulário de avaliação"
          >
            ×
          </button>
        </div>

        {/* Barra de Progresso quando no modo passo a passo */}
        {!confirmedProtocol && !sentToWhatsApp && step > 0 && (
          <div className="quiz-progress-bar-container">
            <progress 
              className="quiz-progress-bar" 
              value={step + 1} 
              max={totalSteps} 
              aria-label={`Progresso: Etapa ${step + 1} de ${totalSteps}`} 
            />
          </div>
        )}

        {/* Conteúdo do Modal */}
        <div className="quiz-modal-body">
          {/* TELA DE SUCESSO DO WHATSAPP DIRETO */}
          {sentToWhatsApp ? (
            <div className="quiz-success-view" style={{ textAlign: 'center', padding: '16px 0' }}>
              <div 
                style={{ 
                  width: '64px', 
                  height: '64px', 
                  background: isDark ? 'rgba(34, 197, 94, 0.2)' : '#dcfce7', 
                  color: isDark ? '#4ade80' : '#16a34a', 
                  borderRadius: '50%', 
                  display: 'grid', 
                  placeItems: 'center', 
                  margin: '0 auto 16px auto' 
                }}
              >
                <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              </div>

              <h3 style={{ fontSize: '22px', margin: '0 0 8px 0', color: 'var(--ink)' }}>
                Conversa Iniciada no WhatsApp!
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--muted)', maxWidth: '420px', margin: '0 auto 20px auto', lineHeight: 1.6 }}>
                Sua mensagem com todos os detalhes foi formatada e enviada para o canal de atendimento da <strong>Resolve Notebook</strong>. Nossa equipe técnica na Santa Ifigênia responderá em instantes.
              </p>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button 
                  type="button" 
                  className="button button-yellow" 
                  onClick={handleSendDirectWhatsApp}
                  style={{ background: '#25d366', color: '#fff', fontSize: '13px', padding: '12px 22px' }}
                >
                  Abrir WhatsApp novamente
                </button>
                <button 
                  type="button" 
                  className="button button-dark" 
                  onClick={handleClose}
                  style={{ fontSize: '13px', padding: '12px 22px' }}
                >
                  Fechar
                </button>
              </div>
            </div>
          ) : confirmedProtocol ? (
            /* Tela de Confirmação Final com Protocolo */
            <div className="quiz-success-view">
              <div className="quiz-success-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              </div>
              <p className="quiz-protocol-label">Seu número de protocolo é:</p>
              <div className="quiz-protocol-code" aria-label={`Protocolo de atendimento ${confirmedProtocol}`}>
                {confirmedProtocol}
              </div>
              <p className="quiz-success-desc">
                Olá, <strong>{name}</strong>! Sua solicitação para o notebook <strong>{brand || ''} {model || ''}</strong> foi registrada no sistema.
              </p>
              <p className="quiz-success-note">
                Nossa equipe técnica na Santa Ifigênia analisará suas respostas e entrará em contato pelo WhatsApp <strong>{phone}</strong> com o orçamento prévio.
              </p>
              <div className="quiz-success-actions">
                <a 
                  className="button button-yellow"
                  href={`https://wa.me/5511988095982?text=${encodeURIComponent(`Olá! Enviei uma solicitação pelo site. Meu protocolo é *${confirmedProtocol}*. Gostaria de falar sobre o atendimento.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none', justifyContent: 'center' }}
                >
                  Falar agora no WhatsApp
                </a>
                <button type="button" className="button button-dark" onClick={handleClose}>
                  Fechar
                </button>
              </div>
            </div>
          ) : step === 0 ? (
            /* ETAPA 1: ESCOLHA RÁPIDA OU DIGITAÇÃO DE OUTRO PROBLEMA + ENVIO DIRETO NO WHATSAPP */
            <div>
              <p style={{ fontSize: '13px', color: 'var(--muted)', margin: '0 0 16px 0', lineHeight: 1.5 }}>
                Selecione uma das opções abaixo ou clique em <b>Outro problema</b> para escrever com suas próprias palavras e mandar direto no WhatsApp:
              </p>

              {/* Grid de Opções */}
              <div className="quiz-options-grid" style={{ marginBottom: '18px' }}>
                {issues.map((opt) => {
                  const isSelected = isCustomSelected ? opt === 'Outro problema' : issue === opt;

                  return (
                    <button
                      key={opt}
                      type="button"
                      className={`quiz-option-btn ${isSelected ? 'active' : ''}`}
                      onClick={() => {
                        if (opt === 'Outro problema') {
                          setIsCustomSelected(true);
                          setIssue('Outro problema');
                        } else {
                          setIsCustomSelected(false);
                          setIssue(opt);
                        }
                        setAnswers({});
                      }}
                      style={{
                        borderColor: isSelected ? '#ffd438' : 'var(--line)',
                        background: isSelected ? 'var(--dark)' : 'var(--white)',
                        color: isSelected ? '#ffd438' : 'var(--ink)'
                      }}
                    >
                      {opt === 'Outro problema' ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: '15px', height: '15px', stroke: 'currentColor', fill: 'none', strokeWidth: 2 }}>
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                          </svg>
                          <span>Outro problema (digitar o que aconteceu)</span>
                        </span>
                      ) : (
                        <span>{opt}</span>
                      )}
                      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        {isSelected ? <path d="M20 6L9 17l-5-5"/> : <path d="M5 12h14M12 5l7 7-7 7"/>}
                      </svg>
                    </button>
                  );
                })}
              </div>

              {/* CAMPO DIGITÁVEL QUANDO ESCOLHE "OUTRO PROBLEMA" */}
              {isCustomSelected && (
                <div style={{ background: 'var(--paper)', padding: '18px', borderRadius: '14px', border: '1.5px solid #d4af37', marginBottom: '20px' }}>
                  <label htmlFor="custom-issue-input" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: 'var(--ink)' }}>
                    <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: '15px', height: '15px', stroke: '#ffd438', fill: 'none', strokeWidth: 2 }}>
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                    <span>Descreva o problema do seu notebook:</span>
                  </label>
                  <textarea
                    id="custom-issue-input"
                    rows={3}
                    placeholder="Escreva com suas próprias palavras o que aconteceu... (Ex.: Caiu café no teclado ontem; tela começou a piscar com listras; parou de carregar do nada; ou precisa de troca de SSD...)"
                    value={customIssueText}
                    onChange={(e) => setCustomIssueText(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: isDark ? '1px solid #272730' : '1px solid var(--line)',
                      background: isDark ? '#141418' : '#ffffff',
                      color: 'var(--ink)',
                      fontSize: '14px',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                    autoFocus
                  />
                </div>
              )}

              {/* CAMPOS RÁPIDOS OPCIONAIS (NOME E MODELO) SE JÁ HOUVER UMA OPÇÃO ESCOLHIDA OU DIGITADA */}
              {(issue || isCustomSelected) && (
                <div style={{ background: 'var(--paper)', padding: '16px 18px', borderRadius: '14px', border: '1px solid var(--line)', marginBottom: '20px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px', color: 'var(--muted)' }}>
                        Marca / Modelo do Notebook (opcional):
                      </label>
                      <input
                        type="text"
                        placeholder="Ex.: Dell Inspiron 15, MacBook M1, Acer..."
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: isDark ? '1px solid #272730' : '1px solid var(--line)', background: isDark ? '#141418' : '#fff', color: 'var(--ink)', fontSize: '13px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px', color: 'var(--muted)' }}>
                        Seu Nome (opcional):
                      </label>
                      <input
                        type="text"
                        placeholder="Como podemos te chamar?"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: isDark ? '1px solid #272730' : '1px solid var(--line)', background: isDark ? '#141418' : '#fff', color: 'var(--ink)', fontSize: '13px' }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* BOTÃO PRINCIPAL DE ENVIO DIRETO NO WHATSAPP */}
              {(issue || isCustomSelected) && (
                <div style={{ marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={handleSendDirectWhatsApp}
                    style={{
                      width: '100%',
                      padding: '15px 18px',
                      background: '#25d366',
                      color: '#ffffff',
                      borderRadius: '12px',
                      border: 'none',
                      fontSize: '14.5px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      whiteSpace: 'normal',
                      textAlign: 'center',
                      lineHeight: 1.35,
                      boxShadow: '0 6px 20px rgba(37, 211, 102, 0.35)',
                      transition: 'transform 0.15s ease, background 0.15s ease'
                    }}
                  >
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    Mandar direto no WhatsApp com um Técnico
                  </button>

                  {!isCustomSelected && (
                    <button
                      type="button"
                      onClick={() => goToStep(1)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--muted)',
                        fontSize: '12px',
                        fontWeight: 600,
                        margin: '12px auto 0 auto',
                        display: 'block',
                        cursor: 'pointer',
                        textDecoration: 'underline'
                      }}
                    >
                      Ou se preferir, responder perguntas de pré-diagnóstico passo a passo →
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : !isFinalStep && currentQuestion ? (
            /* ETAPAS GUIADAS OPCIONAIS: Perguntas Específicas */
            <div className="quiz-options-grid">
              {currentQuestion.options.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`quiz-option-btn ${answers[currentQuestion.id] === option ? 'active' : ''}`}
                  onClick={() => {
                    setAnswers(prev => ({ ...prev, [currentQuestion.id]: option }));
                    goToStep(step + 1);
                  }}
                >
                  <span>{option}</span>
                  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              ))}
            </div>
          ) : (
            /* Etapa Final do Diagnóstico Passo a Passo */
            <form onSubmit={handleSubmit} className="quiz-final-form">
              <div className="quiz-summary-pill">
                <strong>Problema:</strong> {isCustomSelected ? (customIssueText || 'Outro problema') : issue}
              </div>

              <div className="quiz-fields-grid">
                <div>
                  <label htmlFor="quiz-brand" className="quiz-label">
                    Marca do Notebook: <span className="req">*</span>
                  </label>
                  <select
                    id="quiz-brand"
                    required
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="quiz-input"
                  >
                    <option value="">Selecione a marca…</option>
                    {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>

                <div>
                  <label htmlFor="quiz-model" className="quiz-label">
                    Modelo ou Série: <span className="opt">(opcional)</span>
                  </label>
                  <input
                    id="quiz-model"
                    type="text"
                    maxLength={100}
                    placeholder="Ex.: Dell Inspiron 15, Lenovo Ideapad 3…"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="quiz-input"
                  />
                </div>

                <div>
                  <label htmlFor="quiz-name" className="quiz-label">
                    Seu Nome: <span className="req">*</span>
                  </label>
                  <input
                    id="quiz-name"
                    type="text"
                    required
                    placeholder="Como prefere ser chamado(a)?"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="quiz-input"
                    autoComplete="name"
                  />
                </div>

                <div>
                  <label htmlFor="quiz-phone" className="quiz-label">
                    WhatsApp com DDD: <span className="req">*</span>
                  </label>
                  <input
                    id="quiz-phone"
                    type="tel"
                    required
                    inputMode="numeric"
                    placeholder="(11) 98809-5982"
                    value={phone}
                    onChange={(e) => setPhone(handleFormatPhone(e.target.value))}
                    className="quiz-input"
                    autoComplete="tel"
                  />
                </div>

                <div className="full-width">
                  <label htmlFor="quiz-notes" className="quiz-label">
                    Observações adicionais: <span className="opt">(opcional)</span>
                  </label>
                  <textarea
                    id="quiz-notes"
                    rows={2}
                    placeholder="Algum detalhe extra? Ex: caiu água ontem, não faz barulho de cooler..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="quiz-input"
                  />
                </div>
              </div>

              {submitError && (
                <div className="quiz-error-msg" role="alert">
                  {submitError}
                </div>
              )}

              <div className="quiz-actions-footer">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="button button-yellow quiz-submit-btn"
                >
                  {isSubmitting ? 'Enviando solicitação…' : 'Enviar solicitação'}
                  {!isSubmitting && (
                    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Rodapé com botão Voltar quando em etapas guiadas */}
        {!confirmedProtocol && !sentToWhatsApp && step > 0 && (
          <div className="quiz-modal-footer">
            <button 
              type="button" 
              className="back-button" 
              onClick={() => goToStep(step - 1)}
              disabled={isSubmitting}
            >
              ← Voltar etapa anterior
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
