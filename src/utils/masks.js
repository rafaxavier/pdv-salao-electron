export function phoneMask(value) {
  if (!value) return ""
  value = value.replace(/\D/g, '')
  value = value.replace(/(\d{2})(\d)/, "($1) $2")
  value = value.replace(/(\d)(\d{4})$/, "$1-$2")
  return value
}

export function cpfMask(value) {
    if (!value) return "";
    value = value.replace(/\D/g, '');
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return value;
}

//  **** Mascara de monetária
// 65.5 => R$65,50
export function moneyMask(value) {
  if (!value) return "";

  value = value.replace(/\D/g, '');
  value = parseFloat(value) / 100;
  // Formata como moeda brasileira
  value = value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  return value;
}

// R$65,50 => 65.5
export function unmaskMoney(value) {
  value = value.replace(/[^\d,.]/g, '');
  value = value.replace(',', '.');
  value = parseFloat(value);
  return value;
}

// **** Mascara de percentual
// 0.33 => 33%
export function percentMask(value) {
  if (!value) return "";

  value = value.replace(/\D/g, '');
  if (value !== "") {
    value += "%";
  }
  return value;
}
// 33% => 0.33
export function unmaskPercent(value) {
  value = value.replace(/[^\d]/g, '');
  value = parseFloat(value) / 100;
  return value;
}

export function formatDateTime(dateTimeString) {
  const date = new Date(dateTimeString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Mês começa do zero
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

// '2024-W26' => {"start": "2024-06-24T00:00","end": "2024-06-30T00:00"}
export function convertWeekToDatetimeLocal(weekString) {
  const [year, week] = weekString.split('-W');
  const firstDayOfYear = new Date(Date.UTC(year, 0, 1));
  const daysOffset = (firstDayOfYear.getUTCDay() <= 4 ? firstDayOfYear.getUTCDay() : firstDayOfYear.getUTCDay() + 7) - 1;
  const startDate = new Date(firstDayOfYear.getTime() + (week - 1) * 7 * 24 * 60 * 60 * 1000 - daysOffset * 24 * 60 * 60 * 1000);
  const endDate = new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000);

  const formatDateTimeLocal = (date) => {
    const yearStr = date.getUTCFullYear();
    const monthStr = String(date.getUTCMonth() + 1).padStart(2, '0');
    const dayStr = String(date.getUTCDate()).padStart(2, '0');
    return `${yearStr}-${monthStr}-${dayStr}T00:00`;
  };

  return {
    start: formatDateTimeLocal(startDate),
    end: formatDateTimeLocal(endDate)
  };
}