import { myToast } from '../components/toast.js';
import { getAllServicos } from '../requests/servicos-ipc.js';
import { getAllColaboradores } from '../requests/colaboradores-ipc.js';
import { getAllClientes } from '../requests/clientes-ipc.js';
import { createVenda, getAllVendas, deleteVenda } from '../requests/vendas-ipc.js';
import { convertMonthToDatetimeLocal, convertWeekToDatetimeLocal, formatDateTime, generatePDF, unmaskMoney, unmaskPercent } from '../utils/masks.js';

let todosServicos = [];
let todosColaboradores = [];
let todasVendas = [];
let todosClientes = [];
let itensSelecionados = [];
let objServicosSelecionados = [];
let allCheckboxes = [];
let servicosTratados = [];
let arr = [];

const newServiceButton = document.getElementById("open-modal-cria-venda");
const inputID = document.getElementById('id-servico');
const inputData = document.getElementById('data');
const modalVenda = document.getElementById('modal-cria-venda');
const titleModal = document.getElementById('title-modal');
const salvarVendas = document.getElementById('btn-salvar-venda');
const contentDiv = document.getElementById('content');
const table = document.createElement('table');
const selectColaboradores = document.getElementById('select-colaboradores');
const selectClientes = document.getElementById('select-clientes');
const checkBoxContainer = document.getElementById('checkbox-container');
const showTotal = document.getElementById('total');
const showSelectedServices = document.querySelector('.show-selected-services');
const strTotalDesconto = document.createElement('h3');
const strTotalRepasse = document.createElement('h3');
const filtroColaborador = document.getElementById('filtro-colaborador');
const filtroCliente = document.getElementById('filtro-cliente');
const filtroSemana = document.getElementById('filtro-semana');
const filtroMes = document.getElementById('filtro-mes');
const btnFiltrar = document.getElementById('btn-filtrar');
const btnLimparFiltro = document.getElementById('btn-limpar-filtro');
const btnGerarPdf = document.getElementById('btn-gerar-pdf');
const quebra = document.createElement('br');

// ####### cria venda
async function criarVenda() {
  const data = inputData.value;
  const cliente = selectClientes.value;
  const colaborador = selectColaboradores.value;
  const servicos = objServicosSelecionados;

  if (data !== '' && cliente !== '' && colaborador !== '' && servicos.length > 0) {
    servicosTratados = [];
    servicos.forEach((e) => {
      let interno = [];
      e.forEach((a, index) => {
        // extraindo somente o valor das keys
        switch (index) {
          case 1:
            interno.push(unmaskMoney(a.split(":")[1]));
            break;
          case 2:
            interno.push(unmaskPercent(a.split(":")[1]));
            break;
          case 3:
            interno.push(unmaskMoney(a.split(":")[1]));
            break;
          case 4:
            interno.push(unmaskMoney(a.split(":")[1]));
            break;
          default:
            interno.push(a.split(":")[1]);
            break;
        }
      })
      servicosTratados.push(interno);
    })

    await createVenda(data, cliente, colaborador, servicosTratados)
      .then((res) => {
        clearInputFields();
        modalVenda.style.display = 'none';
        myToast(res.msg, 'success');
        refreshListaVendas();
      })
      .catch((err) => {
        modalVenda.style.display = 'none';
        myToast(err, 'error');
        refreshListaVendas();
      });
  } else {
    console.log('falta campo');
  }
}

// ####### deleta venda
async function deletaVenda(id) {
  try {
    await showAlert();
    await deleteVenda(id);
    myToast('Deletado com sucesso!', 'success');
    refreshListaVendas();
  } catch {
    console.log('Ação de exclusão cancelada');
  }
}

// Alerta confirmacao de exclusao
function showAlert() {
  const modal = document.getElementById("custom-alert");
  const closeButton = document.getElementsByClassName("close-btn")[0];
  const confirmButton = document.getElementById("confirm-delete");
  const cancelButton = document.getElementById("cancel-delete");

  return new Promise((resolve, reject) => {
    modal.style.display = "block";
    closeButton.onclick = function () {
      modal.style.display = "none";
      reject();
    };

    cancelButton.onclick = function () {
      modal.style.display = "none";
      reject();
    };

    confirmButton.onclick = function () {
      modal.style.display = "none";
      resolve();
    };

    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
        reject();
      }
    };
  });
}

// renderiza as opcoes do select
function renderSelectOptions(selectElement, options) {
  selectElement.innerHTML = '';
  selectElement.classList.add('select-input');
  options.forEach(option => {
    const optionElement = document.createElement('option');
    optionElement.value = option.id;
    optionElement.textContent = option.name;
    selectElement.appendChild(optionElement);
  });
}

function handlerLimparFiltro() {
  refreshListaVendas();
  btnLimparFiltro.removeEventListener('click', handlerLimparFiltro)
}

btnFiltrar.addEventListener('click', async () => {
  let { name: clienteName, value: clienteValue } = filtroCliente;
  let { name: colaboradorName, value: colaboradorValue } = filtroColaborador;
  let { name: semanaName, value: semanaValue } = filtroSemana;
  let { name: mesName, value: mesValue } = filtroMes;
  let startDate = '';
  let endDate = '';

  btnGerarPdf.setAttribute('hidden', '');
  btnGerarPdf.removeEventListener('click', generatePDF);
  btnLimparFiltro.removeEventListener('click', handlerLimparFiltro);

  arr = todasVendas;

  if (semanaValue !== '') {
    filtroMes.value = '';
    mesValue = '';
    const week = convertWeekToDatetimeLocal(filtroSemana.value);
    startDate = new Date(week.start);
    endDate = new Date(week.end);

    arr = arr.filter(e => {
      const vendaDate = new Date(e.data);
      return vendaDate >= startDate && vendaDate <= endDate;
    });
  }

  if (mesValue !== '') {
    filtroSemana.value = '';
    semanaValue = '';
    const mes = convertMonthToDatetimeLocal(filtroMes.value);
    startDate = new Date(mes.start);
    endDate = new Date(mes.end);

    arr = arr.filter(e => {
      const vendaDate = new Date(e.data);
      return vendaDate >= startDate && vendaDate <= endDate;
    });
  }

  if (clienteValue !== '') {
    arr = arr.filter(e => e.cliente.toLowerCase().includes(clienteValue));
  }

  if (colaboradorValue !== 'Colaborador') {
    if (semanaValue !== '' || mesValue !== '') {
      let periodo = `Período: ${formatDateTime(startDate)} á ${formatDateTime(endDate)}`;

      btnGerarPdf.removeAttribute('hidden');
      btnGerarPdf.addEventListener('click', () => generatePDF(arr, periodo));
    }

    arr = arr.filter(e => e.colaborador.includes(colaboradorValue));
  }

  table.innerHTML = '';
  contentDiv.innerHTML = '';
  criarListaDeVendas(arr);

  btnLimparFiltro.addEventListener('click', handlerLimparFiltro);
});

// exibe os servicos na medida que sao selecionados
function updateSelectedServices() {
  itensSelecionados = [];
  objServicosSelecionados = [];
  showSelectedServices.textContent = '';

  allCheckboxes = document.querySelectorAll('.dropdown-content input[type="checkbox"]:checked');
  allCheckboxes.forEach(function (checkbox) {
    itensSelecionados.push(checkbox.value);
    showSelectedServices.textContent = '';

    let val = checkbox.value.replace(/\s+/g, '').split("-");

    objServicosSelecionados.push(val);

    // formatando exibicao de servicos selecionados
    itensSelecionados.forEach(element => {
      let showService0 = document.createElement('p');
      let showService1 = document.createElement('p');
      let showService2 = document.createElement('p');
      let part = element.split('-');
      showService0.textContent = part[0];
      showService1.textContent = part[1] + ' - ' + part[2];
      showService2.textContent = part[3] + ' - ' + part[4];
      showSelectedServices.appendChild(showService0);
      showSelectedServices.appendChild(showService1);
      showSelectedServices.appendChild(showService2);
      showSelectedServices.appendChild(document.createElement('hr'));
    });
  });
}

// criar os labels e checkbox
function renderCheckboxes(e, options) {
  options.forEach(item => {
    let preco = item.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    let taxa = (item.taxa * 100).toFixed(0);
    let desconto = (item.preco * item.taxa).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    let repasse = (item.preco - (item.preco * item.taxa)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const label = document.createElement('label');
    const checkbox = document.createElement('input');

    // valores dos checkbox
    checkbox.type = 'checkbox';
    checkbox.value = `Serviço: ${item.nome} - Preço:${preco} - Taxa: ${taxa}% - Desconto: ${desconto} - Repasse:${repasse}`;
    checkbox.addEventListener('change', updateSelectedServices);

    // labels dos checkbox
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(item.nome));
    e.appendChild(label);
  });
}

function getTimeNow() {
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
  inputData.value = localDatetime;
}

// modal de lancamento de venda
function renderModalNovaVenda() {
  modalVenda.style.display = "block";
  const span = document.getElementsByClassName("close")[0];

  modalVenda.addEventListener('animationstart', getTimeNow)

  renderCheckboxes(checkBoxContainer, todosServicos);
  renderSelectOptions(selectColaboradores, todosColaboradores.map((e) => ({ 'id': e.nome, 'name': e.nome })));
  renderSelectOptions(selectClientes, todosClientes.map((e) => ({ 'id': e.nome, 'name': e.nome })));

  salvarVendas.addEventListener('click', criarVenda);
  titleModal.textContent = 'Criar Serviço';
  clearInputFields();

  span.addEventListener('click', () => {
    modalVenda.removeEventListener('animationstart', getTimeNow)
    clearInputFields();
    modalVenda.style.display = "none";
  });
}

function clearInputFields() {
  objServicosSelecionados = [];
  servicosTratados = [];
  todosServicos = [];
  inputID.value = '';
  inputData.value = '';
  selectClientes.value = '';
  selectColaboradores.value = '';
  // limpando da exibicao os itens selecionados
  showSelectedServices.textContent = '';
  // desmarcando os checkbox's
  allCheckboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });

  filtroCliente.value = '';
  filtroColaborador.value = 'Colaborador';
  filtroSemana.value = '';
  filtroMes.value = '';
  arr = [];

  filtroCliente.value = '';
  table.innerHTML = '';
  table.textContent = '';
  contentDiv.innerHTML = '';
  btnGerarPdf.setAttribute('hidden', '');
}

async function criarListaDeVendas(vendas) {
  table.innerHTML = '';
  let desconto = 0;
  let repasse = 0;
  vendas.forEach(e => {
    const cardContainer = document.createElement('div');
    cardContainer.classList.add('card-container');

    const header = document.createElement('div');
    header.classList.add('card-header');

    const p1 = document.createElement('p');
    const p2 = document.createElement('p');
    const p3 = document.createElement('p');
    const p4 = document.createElement('p');
    const p5 = document.createElement('p');
    p1.textContent = 'COD: ' + e.id;
    p2.textContent = 'Cliente: ' + e.cliente;
    p3.textContent = 'Atendente: ' + e.colaborador;
    p4.textContent = 'Horário: ' + formatDateTime(e.data);
    p5.textContent = 'Ação';

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'X';
    deleteButton.classList.add('btn-danger', 'btn-xsm')
    deleteButton.addEventListener('click', () => deletaVenda(e.id));

    header.appendChild(p1);
    header.appendChild(p2);
    header.appendChild(p3);
    header.appendChild(p4);
    header.appendChild(deleteButton);

    cardContainer.appendChild(header);

    const headerRow = document.createElement('tr');
    const thB0 = document.createElement('th');
    const thB1 = document.createElement('th');
    const thB2 = document.createElement('th');
    const thB3 = document.createElement('th');
    const thB4 = document.createElement('th');

    thB0.textContent = 'Serviço';
    thB1.textContent = 'Preço';
    thB2.textContent = 'Taxa';
    thB3.textContent = 'Desconto';
    thB4.textContent = 'Repasse';
    headerRow.appendChild(thB0);
    headerRow.appendChild(thB1);
    headerRow.appendChild(thB2);
    headerRow.appendChild(thB3);
    headerRow.appendChild(thB4);

    const tabela = document.createElement('table');

    tabela.appendChild(headerRow)

    cardContainer.appendChild(tabela);

    e.servicos.forEach(a => {
      const row = document.createElement('tr');
      const column0 = document.createElement('td');
      const column1 = document.createElement('td');
      const column2 = document.createElement('td');
      const column3 = document.createElement('td');
      const column4 = document.createElement('td');

      column0.textContent = a.nome;
      column1.textContent = a.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      column2.textContent = (a.taxa * 100).toFixed(0) + '%';
      column3.textContent = a.desconto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      column4.textContent = a.repasse.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

      row.appendChild(column0);
      row.appendChild(column1);
      row.appendChild(column2);
      row.appendChild(column3);
      row.appendChild(column4);
      tabela.appendChild(row);

      desconto = desconto + a.desconto
      repasse = repasse + a.repasse

    })

    contentDiv.appendChild(cardContainer);
  });

  strTotalDesconto.innerText = ' Total Desconto: ' + desconto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  strTotalDesconto.style = 'padding:0px; margin:0px'

  strTotalRepasse.innerText = ' Total Repasse: ' + repasse.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  strTotalRepasse.style = 'padding:0px; margin:0px'

  showTotal.appendChild(strTotalDesconto);
  showTotal.appendChild(quebra);
  showTotal.appendChild(strTotalRepasse);
};

function refreshListaVendas() {
  clearInputFields();

  getAllVendas()
    .then(vendas => {
      todasVendas = vendas
      criarListaDeVendas(todasVendas);
    })
    .catch(error => {
      console.error('Erro ao carregar vendas:', error);
    });
};

function initialize() {
  getAllVendas()
    .then(vendas => {
      todasVendas = vendas
      criarListaDeVendas(todasVendas);
      addEventListeners();
    })
    .catch(error => {
      console.error('Erro ao carregar Vendas:', error);
    });

  getAllColaboradores()
    .then(colaboradores => {
      todosColaboradores = colaboradores;
      let valueDefault = {
        "id": 0,
        "nome": "Colaborador",
        "profissao": "",
        "cpf": ""
      }

      let arrAux = JSON.parse(JSON.stringify(todosColaboradores));;
      arrAux.unshift(valueDefault)
      renderSelectOptions(filtroColaborador, arrAux.map((e) => ({ 'id': e.nome, 'name': e.nome })));
    })
    .catch(error => {
      console.error('Erro ao carregar Colaboradores:', error);
    });

  getAllClientes()
    .then(clientes => {
      todosClientes = clientes
    })
    .catch(error => {
      console.error('Erro ao carregar Clientes:', error);
    });

  getAllServicos()
    .then(servicos => {
      todosServicos = servicos
    })
    .catch(error => {
      console.error('Erro ao carregar Serviços:', error);
    });

  criarMenu('Home');
}

function addEventListeners() {
  newServiceButton.addEventListener("click", renderModalNovaVenda);
  salvarVendas.addEventListener('click', criarVenda);
}

window.addEventListener('DOMContentLoaded', initialize);
