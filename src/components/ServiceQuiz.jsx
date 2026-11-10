import { useRef, useState } from 'react';
import { buildRepairMessage, getRepairQuestions } from '../data/repairQuestions';

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

export default function ServiceQuiz() {
  const [step, setStep] = useState(0);
  const [issue, setIssue] = useState('');
  const [customText, setCustomText] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [answers, setAnswers] = useState({});
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const heading = useRef(null);
  const questions = getRepairQuestions(issue);
  const finalStep = questions.length + 1;
  const question = questions[step - 1];

  const advance = (next) => {
    setStep(next);
    requestAnimationFrame(() => heading.current?.focus());
  };

  const handleSendWhatsApp = () => {
    const finalProblem = isCustom ? (customText.trim() || 'Outro problema a relatar') : (issue || 'Avaliação geral');
    const message = buildRepairMessage({
      issue: finalProblem,
      customDescription: isCustom ? customText.trim() : '',
      brand,
      model,
      answers
    });
    window.open(`https://wa.me/5511988095982?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="service-quiz">
      <p className="eyebrow" aria-live="polite">Solicitar avaliação · Resolve Notebook</p>
      <h3 ref={heading} tabIndex={-1}>
        {step === 0 
          ? 'Qual problema você percebeu?' 
          : step === finalStep 
            ? 'Para finalizar, qual é o seu notebook?' 
            : question.label}
      </h3>

      {step === 0 ? (
        <div>
          <div className="quiz-options">
            {issues.map(option => {
              const isSelected = isCustom ? option === 'Outro problema' : issue === option;
              return (
                <button 
                  key={option} 
                  type="button" 
                  onClick={() => {
                    if (option === 'Outro problema') {
                      setIsCustom(true);
                      setIssue('Outro problema');
                    } else {
                      setIsCustom(false);
                      setIssue(option);
                    }
                    setAnswers({});
                  }}
                  style={{
                    background: isSelected ? 'var(--dark)' : undefined,
                    color: isSelected ? '#ffd438' : undefined
                  }}
                >
                  {option === 'Outro problema' ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: '15px', height: '15px', stroke: 'currentColor', fill: 'none', strokeWidth: 2 }}>
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                      </svg>
                      <span>Outro problema (digitar)</span>
                    </span>
                  ) : option}
                  <svg aria-hidden="true"><use href="#right" /></svg>
                </button>
              );
            })}
          </div>

          {isCustom && (
            <div style={{ marginTop: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: '14px', height: '14px', stroke: 'currentColor', fill: 'none', strokeWidth: 2 }}>
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
                <span>Descreva com suas palavras o que aconteceu:</span>
              </label>
              <textarea
                rows={3}
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Ex.: Notebook caiu no chão, parou de ligar, tela fica azul..."
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--line)', fontFamily: 'inherit' }}
                autoFocus
              />
            </div>
          )}

          {(issue || isCustom) && (
            <div style={{ marginTop: '18px' }}>
              <button 
                type="button" 
                className="button button-yellow" 
                onClick={handleSendWhatsApp}
                style={{ width: '100%', justifyContent: 'center', background: '#25d366', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span>Mandar direto no WhatsApp com um Técnico</span>
                <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: '16px', height: '16px', stroke: 'currentColor', fill: 'none', strokeWidth: 2 }}>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      ) : step < finalStep ? (
        <div className="quiz-options">
          {question.options.map(option => (
            <button key={option} type="button" onClick={() => {
              setAnswers(previous => ({ ...previous, [question.id]: option }));
              advance(step + 1);
            }}>
              {option}<svg aria-hidden="true"><use href="#right" /></svg>
            </button>
          ))}
        </div>
      ) : (
        <form onSubmit={event => {
          event.preventDefault();
          handleSendWhatsApp();
        }}>
          <p className="selected-issue">{isCustom ? customText : issue}</p>
          <div className="field-grid">
            <label>Marca
              <select required value={brand} onChange={event => setBrand(event.target.value)}>
                <option value="">Selecione a marca</option>
                {['Dell', 'Lenovo', 'Asus', 'Acer', 'HP', 'Samsung', 'Apple / MacBook', 'Avell', 'Outra / não sei'].map(value => <option key={value}>{value}</option>)}
              </select>
            </label>
            <label>Modelo <span>(opcional)</span>
              <input value={model} onChange={event => setModel(event.target.value)} maxLength={100} placeholder="Ex.: Dell Inspiron 15" />
            </label>
          </div>
          <button className="button button-yellow" type="submit">Enviar no WhatsApp <svg aria-hidden="true"><use href="#arrow" /></svg></button>
        </form>
      )}
      {step > 0 && <button type="button" className="back-button" onClick={() => advance(step - 1)}>← Voltar</button>}
    </div>
  );
}
