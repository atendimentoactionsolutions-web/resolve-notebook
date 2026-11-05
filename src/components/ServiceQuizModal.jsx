import React, { useState, useEffect, useRef } from 'react';
import { getRepairQuestions } from '../data/repairQuestions';

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
  const [step, setStep] = useState(0);
  const [issue, setIssue] = useState('');
  const [answers, setAnswers] = useState({});
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [confirmedProtocol, setConfirmedProtocol] = useState(null);
  const [idempotencyKey, setIdempotencyKey] = useState('');

  const dialogRef = useRef(null);
  const headingRef = useRef(null);

  // Inicializa a chave de idempotência e o problema ao abrir
  useEffect(() => {
    if (isOpen) {
      setIdempotencyKey(crypto?.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()));
      setConfirmedProtocol(null);
      setSubmitError('');
      if (initialIssue) {
        setIssue(initialIssue);
        setStep(1);
      } else {
        setStep(0);
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
  }, [isOpen, step, confirmedProtocol]);

  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
    if (openerRef?.current) {
      openerRef.current.focus();
    }
  };

  const questions = getRepairQuestions(issue);
  // Total de etapas: 1 (problema) + questions.length (perguntas específicas) + 1 (dados finais de contato/aparelho)
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

    const payload = {
      idempotencyKey,
      name: name.trim(),
      phone,
      brand,
      model: model.trim(),
      issue,
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
      <div className="quiz-modal-panel" ref={dialogRef}>
        {/* Cabeçalho do Modal */}
        <div className="quiz-modal-header">
          <div>
            {!confirmedProtocol && (
              <p className="eyebrow" aria-live="polite">
                Etapa {step + 1} de {totalSteps} · Solicitar avaliação
              </p>
            )}
            <h2 id="quiz-modal-title" ref={headingRef} tabIndex={-1} className="quiz-modal-title">
              {confirmedProtocol 
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

        {/* Barra de Progresso */}
        {!confirmedProtocol && (
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
          {confirmedProtocol ? (
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
            /* Etapa 1: Lista de Problemas */
            <div className="quiz-options-grid">
              {issues.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className={`quiz-option-btn ${issue === opt ? 'active' : ''}`}
                  onClick={() => {
                    setIssue(opt);
                    setAnswers({});
                    goToStep(1);
                  }}
                >
                  <span>{opt}</span>
                  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              ))}
            </div>
          ) : !isFinalStep && currentQuestion ? (
            /* Etapas 2, 3 e 4: Perguntas Específicas */
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
            /* Etapa 5: Finalização - Dados do Notebook e Contato */
            <form onSubmit={handleSubmit} className="quiz-final-form">
              <div className="quiz-summary-pill">
                <strong>Problema:</strong> {issue}
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
                  <p className="quiz-field-hint">
                    A equipe da RESOLVE Notebook usará este número exclusivamente para enviar o protocolo e tratar da sua avaliação.
                  </p>
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

        {/* Rodapé com botão Voltar */}
        {!confirmedProtocol && step > 0 && (
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
