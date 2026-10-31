import { useRef, useState } from 'react';
import { buildRepairMessage, getRepairQuestions } from '../data/repairQuestions';

const issues = ['Não liga ou não carrega', 'Tela quebrada ou sem imagem', 'Lento, travando ou esquentando', 'Carcaça ou dobradiça quebrada', 'Bateria dura pouco', 'Teclado ou sistema com falhas', 'Contato com líquido', 'Outro problema'];

export default function ServiceQuiz() {
  const [step, setStep] = useState(0);
  const [issue, setIssue] = useState('');
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

  return (
    <div className="service-quiz">
      <p className="eyebrow" aria-live="polite">Etapa {step + 1} de {finalStep + 1} · Solicitar avaliação</p>
      <progress className="quiz-progress" value={step + 1} max={finalStep + 1} aria-label="Progresso do atendimento" />
      <h3 ref={heading} tabIndex={-1}>{step === 0 ? 'Qual problema você percebeu?' : step === finalStep ? 'Para finalizar, qual é o seu notebook?' : question.label}</h3>
      {step < finalStep ? (
        <div className="quiz-options">
          {(step === 0 ? issues : question.options).map(option => (
            <button key={option} type="button" onClick={() => {
              if (step === 0) {
                setIssue(option);
                setAnswers({});
              } else {
                setAnswers(previous => ({ ...previous, [question.id]: option }));
              }
              advance(step + 1);
            }}>
              {option}<svg aria-hidden="true"><use href="#right" /></svg>
            </button>
          ))}
        </div>
      ) : (
        <form onSubmit={event => {
          event.preventDefault();
          const message = buildRepairMessage({ issue, brand, model, answers });
          window.open(`https://wa.me/5511988095982?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
        }}>
          <p className="selected-issue">{issue}</p>
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
          <button className="button button-yellow" type="submit">Solicitar avaliação <svg aria-hidden="true"><use href="#arrow" /></svg></button>
          <p className="dialog-footnote">Confira e envie suas respostas no WhatsApp para falar com a equipe.</p>
        </form>
      )}
      {step > 0 && <button type="button" className="back-button" onClick={() => advance(step - 1)}>← Voltar</button>}
    </div>
  );
}
