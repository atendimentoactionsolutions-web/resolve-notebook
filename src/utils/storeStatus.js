export function getStoreStatus() {
  const now = new Date();
  // São Paulo is UTC-3
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const spTime = new Date(utc - (3600000 * 3));
  
  const day = spTime.getDay(); // 0 is Sunday, 6 is Saturday
  const hour = spTime.getHours();
  const minute = spTime.getMinutes();
  const timeInMinutes = hour * 60 + minute;

  // Monday to Friday: 9h (540m) to 18h (1080m)
  const isWeekday = day >= 1 && day <= 5;
  const isSaturday = day === 6;

  if (isWeekday && timeInMinutes >= 540 && timeInMinutes < 1080) {
    return {
      isOpen: true,
      text: 'Aberto Agora na Santa Ifigênia • Fecha às 18h',
      shortText: 'Aberto Agora',
      color: 'emerald'
    };
  }

  // Saturday: 9h to 15h
  if (isSaturday && timeInMinutes >= 540 && timeInMinutes < 900) {
    return {
      isOpen: true,
      text: 'Aberto Agora na Santa Ifigênia • Fecha às 15h',
      shortText: 'Aberto Agora',
      color: 'emerald'
    };
  }

  return {
    isOpen: false,
    text: 'Loja Física Fechada • WhatsApp Aberto para Orçamentos',
    shortText: 'Atendimento Online',
    color: 'amber'
  };
}
