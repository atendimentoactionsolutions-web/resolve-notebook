// Utilitário de cálculo de taxas de maquininha de cartão
export const DEFAULT_RATES = {
  maxInstallments: 12,
  interestFreeInstallments: 1, // 1 = à vista sem juros; 2..12 = sem juros até N vezes
  calculationMode: 'compound', // 'compound' ou 'simple'
  machineName: 'Maquininha Padrão da Loja',
  debit: 1.39,
  credit1x: 3.15,
  installments: {
    "1": 3.15,
    "2": 4.50,
    "3": 5.40,
    "4": 6.30,
    "5": 7.20,
    "6": 8.10,
    "7": 8.90,
    "8": 9.80,
    "9": 10.70,
    "10": 11.60,
    "11": 12.50,
    "12": 13.40,
    "18": 17.90
  }
};

export function formatMoney(val) {
  const num = Number(val) || 0;
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num);
}

export function formatPercent(val) {
  const num = Number(val) || 0;
  return `${num.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 2 })}%`;
}

export function calculateInstallments(price, rates = DEFAULT_RATES) {
  const numericPrice = typeof price === 'number' ? price : (Number(String(price || 0).replace(/[R$\s]/g, '').replace(/\./g, '').replace(',', '.')) || 0);
  if (!numericPrice || numericPrice <= 0) return [];

  const r = rates || DEFAULT_RATES;
  const max = Number(r.maxInstallments) || 12;
  const interestFree = Number(r.interestFreeInstallments) || 1;
  const instRates = r.installments || DEFAULT_RATES.installments;
  const isNetFactor = r.calculationMode === 'net';

  const results = [];
  for (let n = 1; n <= max; n++) {
    const isFree = n <= interestFree;
    const ratePercent = isFree ? 0 : (Number(instRates[String(n)]) || (3.15 + (n - 1) * 0.9));
    
    let total;
    if (isFree || ratePercent === 0) {
      total = numericPrice;
    } else if (isNetFactor && ratePercent < 100) {
      total = numericPrice / (1 - (ratePercent / 100));
    } else {
      total = numericPrice * (1 + (ratePercent / 100));
    }

    const installmentValue = total / n;
    results.push({
      installment: n,
      ratePercent,
      isFree,
      installmentValue: Math.round(installmentValue * 100) / 100,
      total: Math.round(total * 100) / 100,
      difference: Math.round((total - numericPrice) * 100) / 100
    });
  }

  return results;
}
