import { myToast } from '../components/toast.js';
import { 
  createServico, 
  deleteServico, 
  getAllServicos, 
  updateServico
 } from '../requests/servicos-ipc.js';
import { moneyMask, percentMask, unmaskMoney, unmaskPercent} from '../utils/masks.js';

// ####### cria serviço
async function createService() {
  if (inputNome.value !== '' && inputPreco.value !== '' && inputTaxa.value !== '') {
    const precoDesformatado = unmaskMoney(inputPreco.value);
    const taxaDesformatado = unmaskPercent(inputTaxa.value);
    await createServico(inputNome.value, precoDesformatado, taxaDesformatado)
      .then((res) => {
        clearInputFields();
        modalServico.style.display = 'none';
        myToast(res.msg, 'success');
        refreshTableServices();
      })
      .catch((err) => {
        modalServico.style.display = 'none';
        myToast(err, 'error');
        refreshTableServices();
      });
  }
}

// ####### editar servico
async function updateService() {
  if (inputNome.value !== '' && inputPreco.value !== '') {
    const precoDesformatado = unmaskMoney(inputPreco.value);
    const taxaDesformatado = unmaskPercent(inputTaxa.value);
    await updateServico(inputID.value, inputNome.value, precoDesformatado, taxaDesformatado)
      .then((res) => {
        clearInputFields();
        document.getElementById('modal-cria-servico').style.display = "none";
        myToast(res.msg, 'success');
        refreshTableServices();
      })
      .catch((err) => {
        modalServico.style.display = 'none';
        myToast('err', 'error');
        refreshTableServices();
      });
  }
}

// ####### deleta serviço
async function deletaServico(id) {
  await deleteServico(id);
  myToast('deletado com sucesso!', 'success');
  refreshTableServices();
}

let todosServicos = [];

const searchInput = document.getElementById('searchInput');
const newServiceButton = document.getElementById("open-modal-cria-servico");
const inputID = document.getElementById('id-servico');
const inputNome = document.getElementById('nome-servico');
const inputPreco = document.getElementById('preco');
const inputTaxa = document.getElementById('taxa');
const modalServico = document.getElementById('modal-cria-servico');
const titleModal = document.getElementById('title-modal');
const salvarServicos = document.getElementById('btn-salvar-servico');
const contentDiv = document.getElementById('content');
const table = document.createElement('table');

let debounceTimeout;
searchInput.addEventListener('input', function () {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    const searchText = this.value.toLowerCase();
    const arr = todosServicos.filter(e => e.nome.toLowerCase().includes(searchText));
    table.innerHTML = '';
    criarListaDeServicos(arr);
  }, 300);
});

function renderModal(servico = '') {
  modalServico.style.display = "block";
  const span = document.getElementsByClassName("close")[0];
  const { id, nome, preco, taxa } = servico;

  if (id) {
    titleModal.textContent = 'Editar Serviço';
    inputID.value = id;
    inputNome.value = nome;
    inputPreco.value = preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });;
    inputTaxa.value =`${(taxa * 100).toFixed(0)}%`;
    salvarServicos.removeEventListener('click', createService);
    salvarServicos.addEventListener('click', updateService);
  } else {
    salvarServicos.removeEventListener('click', updateService);
    salvarServicos.addEventListener('click', createService);
    titleModal.textContent = 'Criar Serviço';
    clearInputFields();
  }


  span.addEventListener('click', () => {
    clearInputFields();
    modalServico.style.display = "none";
  });
}

function clearInputFields() {
  inputID.value = '';
  inputNome.value = '';
  inputPreco.value = '';
  inputTaxa.value = '';
}

async function criarListaDeServicos(servicos) {
  table.innerHTML = '';

  const headerRow = document.createElement('tr');
  const th0 = document.createElement('th');
  const th1 = document.createElement('th');
  const th2 = document.createElement('th');
  const th3 = document.createElement('th');
  const th4 = document.createElement('th');

  th0.textContent = 'ID';
  th1.textContent = 'Nome';
  th2.textContent = 'Preço';
  th3.textContent = 'Taxa (%)';
  th4.textContent = 'Ação';
  headerRow.appendChild(th0);
  headerRow.appendChild(th1);
  headerRow.appendChild(th2);
  headerRow.appendChild(th3);
  headerRow.appendChild(th4);
  table.appendChild(headerRow);

  servicos.forEach(servico => {
    const row = document.createElement('tr');
    const column0 = document.createElement('td');
    const column1 = document.createElement('td');
    const column2 = document.createElement('td');
    const column3 = document.createElement('td');
    const column4 = document.createElement('td');
    const deleteButton = document.createElement('button');
    const editButton = document.createElement('button');

    column0.textContent = servico.id;
    column1.textContent = servico.nome;
    column2.textContent = servico.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    column3.textContent = `${(servico.taxa * 100).toFixed(0)}%`;

    editButton.textContent = 'Editar';
    editButton.classList.add('btn-warning', 'btn-sm');
    deleteButton.textContent = 'Deletar';
    deleteButton.classList.add('btn-danger', 'btn-sm')

    deleteButton.addEventListener('click', () => deletaServico(servico.id));
    editButton.addEventListener('click', () => renderModal(servico));

    column4.appendChild(editButton);
    column4.appendChild(deleteButton);

    row.appendChild(column0);
    row.appendChild(column1);
    row.appendChild(column2);
    row.appendChild(column3);
    row.appendChild(column4);

    table.appendChild(row);
  });

  contentDiv.innerHTML = '';
  contentDiv.appendChild(table);
};

function refreshTableServices() {
  searchInput.value = '';
  table.innerHTML = '';
  table.textContent = '';

  getAllServicos()
    .then(servicos => {
      todosServicos = servicos
      criarListaDeServicos(todosServicos);
    })
    .catch(error => {
      console.error('Erro ao carregar serviços:', error);
    });
};

function initialize() {
  getAllServicos()
    .then(servicos => {
      todosServicos = servicos
      criarListaDeServicos(todosServicos);
      addEventListeners();

    })
    .catch(error => {
      console.error('Erro ao carregar Serviços:', error);
    });

  criarMenu('Home');
}

function addEventListeners() {
  newServiceButton.addEventListener("click", renderModal);
  salvarServicos.addEventListener('click', createService);
  inputPreco.addEventListener('input', async (e) => {
    let precoFormatado = moneyMask(inputPreco.value);
    inputPreco.value = precoFormatado;
  });

  inputTaxa.addEventListener('input', async (e) => {
    let precoFormatado = percentMask(inputTaxa.value);
    inputTaxa.value = precoFormatado;
  });
}

window.addEventListener('DOMContentLoaded', initialize);
