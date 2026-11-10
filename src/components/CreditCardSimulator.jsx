import React, { useState, useMemo } from 'react';
import { calculateInstallments, formatMoney, formatPercent } from '../utils/cardCalculator';

export default function CreditCardSimulator({ 
  price, 
  rates, 
  productTitle, 
  defaultInstallment = 12,
  onSelectInstallment,
  showFullTable = false
}) {
  const isDark = typeof document !== 'undefined' && document.body.classList.contains('dark-mode');
  const numericPrice = typeof price === 'number' ? price : (Number(String(price || 0).replace(/[R$\s]/g, '').replace(/\./g, '').replace(',', '.')) || 0);
  
  const simulation = useMemo(() => {
    return calculateInstallments(numericPrice, rates);
  }, [numericPrice, rates]);

  // Default to 12x if available, otherwise the max
  const initialInstallment = Math.min(defaultInstallment, simulation.length > 0 ? simulation.length : 12);
  const [selectedInstallment, setSelectedInstallment] = useState(initialInstallment);
  const [expandedTable, setExpandedTable] = useState(showFullTable);

  const currentOption = useMemo(() => {
    if (!simulation.length) return null;
    return simulation.find(s => s.installment === selectedInstallment) || simulation[simulation.length - 1];
  }, [simulation, selectedInstallment]);

  if (!numericPrice || numericPrice <= 0 || !currentOption) {
    return null;
  }

  const handleSelect = (n) => {
    setSelectedInstallment(n);
    if (onSelectInstallment) {
      const opt = simulation.find(s => s.installment === n);
      onSelectInstallment(opt);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Olá! Tenho interesse no notebook *${productTitle || 'Notebook'}*. ` +
    `Fiz a simulação no site e gostaria de fechar em *${currentOption.installment}x de ${formatMoney(currentOption.installmentValue)}* no cartão. ` +
    `Poderia confirmar a disponibilidade na loja da Santa Ifigênia?`
  );

  return (
    <div className="card-simulator-container" style={{ margin: '20px 0', width: '100%' }}>
      {/* --- REALISTIC OBSIDIAN CREDIT CARD WIDGET --- */}
      <div 
        className="credit-card-widget"
        style={{
          background: 'linear-gradient(135deg, #1b1b22 0%, #0d0d10 55%, #18181f 100%)',
          borderRadius: '18px',
          padding: '24px 24px 20px',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(255, 212, 56, 0.35)',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
          fontFamily: 'inherit'
        }}
      >
        {/* Subtle decorative glow & circuits */}
        <div 
          style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '180px',
            height: '180px',
            background: 'radial-gradient(circle, rgba(255, 212, 56, 0.15) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />

        {/* Card Header: Chip, NFC & Brand */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Metallic Gold EMV Chip */}
            <div 
              style={{
                width: '44px',
                height: '32px',
                background: 'linear-gradient(135deg, #fce074 0%, #dfb235 50%, #9e7b16 100%)',
                borderRadius: '6px',
                position: 'relative',
                boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.6), 0 2px 5px rgba(0,0,0,0.4)',
                border: '1px solid #7c600b'
              }}
            >
              <div 
                style={{
                  position: 'absolute',
                  inset: '5px',
                  border: '1px solid rgba(0,0,0,0.25)',
                  borderRadius: '3px'
                }}
              />
              <div 
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: 0,
                  right: 0,
                  height: '1px',
                  background: 'rgba(0,0,0,0.25)'
                }}
              />
              <div 
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: 0,
                  bottom: 0,
                  width: '1px',
                  background: 'rgba(0,0,0,0.25)'
                }}
              />
            </div>

            {/* Contactless NFC Waves */}
            <svg 
              viewBox="0 0 24 24" 
              style={{ width: '22px', height: '22px', stroke: 'rgba(255, 255, 255, 0.75)', fill: 'none', strokeWidth: 2 }}
            >
              <path d="M8.5 16.5a5 5 0 0 1 0-7" strokeLinecap="round" />
              <path d="M12 19a8.5 8.5 0 0 1 0-14" strokeLinecap="round" />
              <path d="M15.5 21.5a12 12 0 0 1 0-21" strokeLinecap="round" />
            </svg>
          </div>

          {/* Card Label */}
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '11px', letterSpacing: '1px', color: '#ffd438', fontWeight: 800 }}>
              Resolve Card
            </span>
            <span style={{ display: 'block', fontSize: '9px', color: 'rgba(255,255,255,0.5)', letterSpacing: '1px' }}>
              SIMULADOR DE PARCELAMENTO
            </span>
          </div>
        </div>

        {/* Big Highlighted Value in Gold */}
        <div style={{ margin: '8px 0 16px' }}>
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
            Condição no cartão:
          </span>
          <div style={{ fontSize: 'clamp(26px, 6vw, 36px)', fontWeight: 800, color: '#ffd438', letterSpacing: '-0.02em', lineHeight: 1.15, marginTop: '4px' }}>
            {currentOption.installment}x de {formatMoney(currentOption.installmentValue)}
          </div>
        </div>

        {/* Card Footer Breakdown */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px' }}>
          <div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>
              Total no cartão: <strong style={{ color: '#fff' }}>{formatMoney(currentOption.total)}</strong>
            </div>
            <div style={{ fontSize: '11px', color: currentOption.isFree ? '#34d399' : 'rgba(255,255,255,0.55)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              {currentOption.isFree ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                  <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: '12px', height: '12px', stroke: 'currentColor', fill: 'none', strokeWidth: 3 }}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Sem juros
                </span>
              ) : (
                `Taxa da maquininha: ${formatPercent(currentOption.ratePercent)}`
              )}
              {' · '}À vista no Pix: <span style={{ color: '#ffd438' }}>{formatMoney(numericPrice)}</span>
            </div>
          </div>

          {/* Card Brand Flags */}
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span style={{ fontSize: '9px', fontWeight: 700, padding: '3px 7px', background: 'rgba(255,255,255,0.12)', borderRadius: '4px', letterSpacing: '0.5px' }}>
              VISA
            </span>
            <span style={{ fontSize: '9px', fontWeight: 700, padding: '3px 7px', background: 'rgba(255,255,255,0.12)', borderRadius: '4px', letterSpacing: '0.5px' }}>
              MASTERCARD
            </span>
            <span style={{ fontSize: '9px', fontWeight: 700, padding: '3px 7px', background: 'rgba(255,255,255,0.12)', borderRadius: '4px', letterSpacing: '0.5px' }}>
              ELO
            </span>
            <span style={{ fontSize: '9px', fontWeight: 700, padding: '3px 7px', background: 'rgba(255,255,255,0.12)', borderRadius: '4px', letterSpacing: '0.5px' }}>
              HIPER
            </span>
          </div>
        </div>
      </div>

      {/* --- INTERACTIVE CONTROLS --- */}
      <div 
        style={{ 
          background: 'var(--white, #ffffff)', 
          border: '1px solid var(--line, #e2e8f0)', 
          borderTop: 'none', 
          borderRadius: '0 0 16px 16px', 
          padding: '16px 18px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
          <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink, #17201f)' }}>
            Simular outra quantidade de parcelas:
          </label>
          <button
            type="button"
            className="card-table-toggle-btn"
            onClick={() => setExpandedTable(!expandedTable)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '11px',
              fontWeight: 700,
              color: isDark ? '#ffd438' : '#876c00',
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: 0
            }}
          >
            {expandedTable ? 'Ocultar tabela' : 'Ver tabela completa (1x a 12x)'}
          </button>
        </div>

        {/* Quick Installment Pills Selector */}
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(46px, 1fr))', 
            gap: '6px', 
            marginBottom: '14px' 
          }}
        >
          {simulation.map((s) => {
            const isSelected = s.installment === selectedInstallment;
            return (
              <button
                key={s.installment}
                type="button"
                className={`sim-pill-btn ${isSelected ? 'is-active' : ''}`}
                onClick={() => handleSelect(s.installment)}
                style={{
                  padding: '7px 4px',
                  borderRadius: '8px',
                  border: isSelected ? '1.5px solid #ffd438' : (isDark ? '1px solid #2e2e38' : '1px solid var(--line, #e2e8f0)'),
                  background: isSelected ? '#ffd438' : (isDark ? '#18181c' : 'var(--paper, #f8fafc)'),
                  color: isSelected ? '#000000' : (isDark ? '#f4f4f5' : 'var(--ink, #17201f)'),
                  fontWeight: isSelected ? 800 : 600,
                  fontSize: '12px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.15s ease'
                }}
                title={`${s.installment}x de ${formatMoney(s.installmentValue)} (Total: ${formatMoney(s.total)})`}
              >
                {s.installment}x
              </button>
            );
          })}
        </div>

        {/* Full Table Breakdown (when expanded) */}
        {expandedTable && (
          <div style={{ maxHeight: '220px', overflowY: 'auto', overflowX: 'auto', WebkitOverflowScrolling: 'touch', marginBottom: '14px', border: '1px solid var(--line, #e2e8f0)', borderRadius: '10px' }}>
            <table style={{ width: '100%', minWidth: '280px', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ background: 'var(--paper, #f1f5f9)', textAlign: 'left', borderBottom: '1px solid var(--line, #e2e8f0)' }}>
                  <th style={{ padding: '8px 10px', fontWeight: 700, color: 'var(--ink)' }}>Parcelas</th>
                  <th style={{ padding: '8px 10px', fontWeight: 700, color: 'var(--ink)' }}>Valor Parcela</th>
                  <th style={{ padding: '8px 10px', fontWeight: 700, color: 'var(--ink)' }}>Total a Pagar</th>
                  <th style={{ padding: '8px 10px', fontWeight: 700, textAlign: 'right', color: 'var(--ink)' }}>Taxa</th>
                </tr>
              </thead>
              <tbody>
                {simulation.map((s) => {
                  const isSelected = s.installment === selectedInstallment;
                  return (
                    <tr 
                      key={s.installment}
                      onClick={() => handleSelect(s.installment)}
                      style={{ 
                        borderBottom: '1px solid var(--line, #f1f5f9)', 
                        background: isSelected ? 'rgba(255, 212, 56, 0.18)' : 'transparent',
                        cursor: 'pointer',
                        fontWeight: isSelected ? 700 : 400
                      }}
                    >
                      <td style={{ padding: '8px 10px', color: isSelected ? (isDark ? '#ffd438' : '#854d0e') : (isDark ? '#f4f4f5' : '#17201f'), fontWeight: isSelected ? 800 : 500 }}>{s.installment}x</td>
                      <td style={{ padding: '8px 10px', color: isSelected ? (isDark ? '#ffd438' : '#854d0e') : (isDark ? '#f4f4f5' : '#17201f'), fontWeight: isSelected ? 800 : 500 }}>
                        {formatMoney(s.installmentValue)}
                      </td>
                      <td style={{ padding: '8px 10px', color: isSelected ? (isDark ? '#ffffff' : '#17201f') : (isDark ? '#d4d4d8' : '#4b5563'), fontWeight: isSelected ? 800 : 500 }}>{formatMoney(s.total)}</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', color: s.isFree ? (isDark ? '#34d399' : '#16a34a') : (isSelected ? (isDark ? '#ffd438' : '#854d0e') : (isDark ? '#a1a1aa' : '#64748b')) }}>
                        {s.isFree ? 'Sem juros' : formatPercent(s.ratePercent)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Info & WhatsApp CTA */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11px', color: 'var(--muted, #64748b)', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: '13px', height: '13px', stroke: '#34d399', fill: 'none', strokeWidth: 2.5, flexShrink: 0 }}>
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>Taxas reais da maquininha da loja física. Passe seu cartão em até {simulation.length}x.</span>
          </span>

          <a 
            href={`https://wa.me/5511988095982?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="sim-pass-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              background: '#25d366',
              color: '#ffffff',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 700,
              textDecoration: 'none'
            }}
          >
            <span>Passar nesta condição</span>
            <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: '14px', height: '14px', stroke: 'currentColor', fill: 'none', strokeWidth: 2.2 }}>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
