import { getOneColaboradorByName } from '../requests/colaboradores-ipc.js';

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

  const formatDateTimeLocal = (date, isEndOfDay = false) => {
    const yearStr = date.getUTCFullYear();
    const monthStr = String(date.getUTCMonth() + 1).padStart(2, '0');
    const dayStr = String(date.getUTCDate()).padStart(2, '0');
    const timeStr = isEndOfDay ? '23:59' : '00:00';
    return `${yearStr}-${monthStr}-${dayStr}T${timeStr}`;
  };

  return {
    start: formatDateTimeLocal(startDate),
    end: formatDateTimeLocal(endDate, true)
  };
}

export function convertMonthToDatetimeLocal(monthString) {
  const [year, month] = monthString.split('-').map(Number);

  const startDate = new Date(Date.UTC(year, month - 1, 1));
  const endDate = new Date(Date.UTC(year, month, 0)); // Último dia do mês

  const formatDateTimeLocal = (date, isEndOfDay = false) => {
    const yearStr = date.getUTCFullYear();
    const monthStr = String(date.getUTCMonth() + 1).padStart(2, '0');
    const dayStr = String(date.getUTCDate()).padStart(2, '0');
    const timeStr = isEndOfDay ? '23:59' : '00:00';
    return `${yearStr}-${monthStr}-${dayStr}T${timeStr}`;
  };

  return {
    start: formatDateTimeLocal(startDate),
    end: formatDateTimeLocal(endDate, true) // Configura o final do dia como 23:59
  };
}

export async function generatePDF(arr, periodo) {
  const allServices = arr.flatMap(e => e.servicos.map(servico => ({
    idVenda: e.id,
    cliente: e.cliente,
    colaborador: e.colaborador,
    data: formatDateTime(e.data),
    ...servico
  })));

  const colaborador = await getOneColaboradorByName(allServices[0].colaborador);
  const dtPeriodo = periodo ?? `Período: ${allServices[0].data} á ${allServices[allServices.length - 1].data}`;

  const totals = allServices.reduce((acc, service) => {
    acc.preco += service.preco;
    acc.taxa += service.taxa;
    acc.desconto += service.desconto;
    acc.repasse += service.repasse;
    return acc;
  }, { preco: 0, taxa: 0, desconto: 0, repasse: 0 });

  let props = {
    outputType: jsPDFInvoiceTemplate.OutputType.Save,
    returnJsPDFDocObject: true,
    fileName: "Relatório 2021",
    orientationLandscape: false,
    compress: true,
    logo: {
      // src: "https://raw.githubusercontent.com/edisonneza/jspdf-invoice-template/demo/images/logo.png",
      src: "../../../assets/logo.png",
      type: 'PNG', //optional, when src= data:uri (nodejs case)
      width: 35, //aspect ratio = width/height
      height: 35,
      margin: {
        top: -5, //negative or positive num, from the current position
        left: -5 //negative or positive num, from the current position
      }
    },
    business: {
      name: "Espaço Raynne Souza",
      address: "Tv. Um, 137 - Recreio, Rio das Ostras - RJ",
      phone: "(+22) 99999-9999",
      email: "email@example.com",
      website: "www.example.com",
    },
    contact: {
      label: `${colaborador.res.profissao}: `,
      name: colaborador.res.nome,
      address: `CPF: ${colaborador.res.cpf}`,
      // phone: `CPF: ${colaborador.res.cpf}`,
      // email: `CPF: ${colaborador.res.cpf}`,
    },
    invoice: {
      label: dtPeriodo,
      num: '.',
      // invDate: dtPeriodo,
      // invGenDate: "Período: 02/02/2021 10:17",
      headerBorder: true,
      tableBodyBorder: true,
      header: [
        {
          title: "COD",
          style: {
            width: 10
          }
        },
        {
          title: "Cliente",
          style: {
            width: 40
          }
        },
        {
          title: "Serviços",
          style: {
            width: 45
          }
        },
        {
          title: "Horário",
          style: {
            width: 30,
          }
        },
        {
          title: "Preço",
          style: {
            width: 20,
          }
        },
        {
          title: "Taxa",
          style: {
            width: 12,
          }
        },
        {
          title: "Desconto",
          style: {
            width: 18,
          }
        },
        {
          title: "Repasse",
          style: {
            width: 18,
          }
        }
      ],
      table: allServices.map(service => [
        service.idVenda,
        service.cliente,
        service.nome,
        service.data,
        service.preco.toFixed(2),
        (service.taxa * 100).toFixed(0) + '%',
        service.desconto.toFixed(2),
        service.repasse.toFixed(2)
      ]),
      additionalRows: [{
        col1: 'Total:',
        col2: totals.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        style: {
          fontSize: 10 //optional, default 12
        }
      },
      {
        col1: 'Desconto:',
        col2: '- ' + totals.desconto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        style: {
          fontSize: 10 //optional, default 12
        }
      },
      {
        col1: 'SubTotal(Repasse):',
        col2: totals.repasse.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        style: {
          fontSize: 14 //optional, default 12
        }
      }],
    },
    footer: {
      text: "The invoice is created on a computer and is valid without the signature and stamp.",
    },
    pageEnable: true,
    pageLabel: "Page ",

  };

  jsPDFInvoiceTemplate.default(props);
}

export function getTimeNow() {
  let now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  let day = now.getDate();
  let hour = now.getHours();
  let minute = now.getMinutes();
  let localDatetime = year + "-" +
    (month < 10 ? "0" + month.toString() : month) + "-" +
    (day < 10 ? "0" + day.toString() : day) + "T" +
    (hour < 10 ? "0" + hour.toString() : hour) + ":" +
    (minute < 10 ? "0" + minute.toString() : minute);

  return localDatetime;
}