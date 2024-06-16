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
