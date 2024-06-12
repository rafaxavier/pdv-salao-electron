import { myToast } from '../../components/toast.js';
import { cpfMask, phoneMask } from '../../utils/masks.js';

// CRUD Requisicoes IPC
const getAllClientes = () => {
  return new Promise((resolve, reject) => {
    window.electron.ipcRenderer.sendMessage('obterClientes');
    window.electron.ipcRenderer.once('obterClientesResult', (resposta) => {
      resolve(resposta.clientes);
    });
  });
};

const createCliente = (nome, telefone, cpf) => {
  return new Promise((resolve, reject) => {
    window.electron.ipcRenderer.sendMessage('criarClientes', { nome, telefone, cpf });
    window.electron.ipcRenderer.once('criarClientesResult', (resposta) => {
      console.log(resposta);
      resolve(resposta);
    });
  });
};

const deleteCliente = (id) => {
  return new Promise((resolve, reject) => {
    window.electron.ipcRenderer.sendMessage('deletarClientes', { id });
    window.electron.ipcRenderer.once('deletarClientesResult', (resposta) => {
      console.log(resposta);
      resolve(resposta);
    });
  });
};

const updateCliente = (id, nome, telefone, cpf) => {
  return new Promise((resolve, reject) => {
    window.electron.ipcRenderer.sendMessage('editarClientes', { id, nome, telefone, cpf });
    window.electron.ipcRenderer.once('editarClientesResult', (resposta) => {
      console.log(resposta);
      resolve(resposta);
    });
  });
};

/***************************************************************************************** */
// ####### cria cliente
async function createClient() {
  if (inputNome.value !== ''  && inputPhone.value.length > 14 && inputCpf.value.length == 14) {
    await createCliente(inputNome.value,  inputPhone.value, inputCpf.value)
      .then((res) => {
        clearInputFields();
        modalCliente.style.display = 'none';
        myToast(res.msg, 'success');
        refreshTableEmployees();
      })
      .catch((err) => {
        modalCliente.style.display = 'none';
        myToast(err, 'error');
        refreshTableEmployees();
      });
  }
}

// ####### editar cliente
async function updateEmployee() {
  if (inputNome.value !== '' ) {
    await updateCliente(inputID.value, inputNome.value, inputPhone.value, inputCpf.value)
      .then((res) => {
        clearInputFields();
        document.getElementById('modal-cria-cliente').style.display = "none";
        myToast(res.msg, 'success');
        refreshTableEmployees();
      })
      .catch((err) => {
        modalCliente.style.display = 'none';
        myToast('err', 'error');
        refreshTableEmployees();
      });
  }
}

// ####### deleta cliente
async function deletaCliente(id) {
  await deleteCliente(id);
  myToast('deletado com sucesso!', 'success');
  refreshTableEmployees();
}

let todosClientes = [];

const searchInput = document.getElementById('searchInput');
const newEmployeeButton = document.getElementById("open-modal-cria-cliente");
const inputID = document.getElementById('id-cliente');
const inputNome = document.getElementById('nome-cliente');
const inputPhone = document.getElementById('telefone-cliente');
const inputCpf = document.getElementById('cpf-cliente');
const modalCliente = document.getElementById('modal-cria-cliente');
const titleModal = document.getElementById('title-modal');
const salvarCliente = document.getElementById('btn-salvar-cliente');
const contentDiv = document.getElementById('content');
const table = document.createElement('table');

let debounceTimeout;
searchInput.addEventListener('input', function () {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    const searchText = this.value.toLowerCase();
    const arr = todosClientes.filter(e => e.nome.toLowerCase().includes(searchText));
    table.innerHTML = '';
    criarListaDeClientes(arr);
  }, 300);
});

function renderModal(cliente = '') {
  modalCliente.style.display = "block";
  const span = document.getElementsByClassName("close")[0];
  const { id, nome, telefone, cpf } = cliente;

  if (id) {
    titleModal.textContent = 'Editar Cliente';
    inputID.value = id;
    inputNome.value = nome;
    inputPhone.value = telefone;
    inputCpf.value = cpf;
    salvarCliente.removeEventListener('click', createClient);
    salvarCliente.addEventListener('click', updateEmployee);
  } else {
    salvarCliente.removeEventListener('click', updateEmployee);
    salvarCliente.addEventListener('click', createClient);
    titleModal.textContent = 'Criar Cliente';
    clearInputFields();
  }


  span.addEventListener('click', () => {
    clearInputFields();
    modalCliente.style.display = "none";
  });
}

function clearInputFields() {
  inputID.value = '';
  inputNome.value = '';
  inputPhone.value = '';
  inputCpf.value = '';
}

async function criarListaDeClientes(clientes) {
  table.innerHTML = '';

  const headerRow = document.createElement('tr');
  const th0 = document.createElement('th');
  const th1 = document.createElement('th');
  const th2 = document.createElement('th');
  const th3 = document.createElement('th');
  const th4 = document.createElement('th');

  th0.textContent = 'ID';
  th1.textContent = 'Nome';
  th2.textContent = 'Telefone';
  th3.textContent = 'Cpf';
  th4.textContent = 'Ação';
  headerRow.appendChild(th0);
  headerRow.appendChild(th1);
  headerRow.appendChild(th2);
  headerRow.appendChild(th3);
  headerRow.appendChild(th4);
  table.appendChild(headerRow);

  clientes.forEach(cliente => {
    const row = document.createElement('tr');
    const column0 = document.createElement('td');
    const column1 = document.createElement('td');
    const column2 = document.createElement('td');
    const column3 = document.createElement('td');
    const column4 = document.createElement('td');
    const deleteButton = document.createElement('button');
    const editButton = document.createElement('button');

    column0.textContent = cliente.id;
    column1.textContent = cliente.nome;
    column2.textContent = cliente.telefone;
    column3.textContent = cliente.cpf;

    editButton.textContent = 'Editar';
    editButton.classList.add('btn-warning', 'btn-sm');
    deleteButton.textContent = 'Deletar';
    deleteButton.classList.add('btn-danger', 'btn-sm')

    deleteButton.addEventListener('click', () => deletaCliente(cliente.id));
    editButton.addEventListener('click', () => renderModal(cliente));

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

function refreshTableEmployees() {
  searchInput.value = '';
  table.innerHTML = '';
  table.textContent = '';

  getAllClientes()
    .then(clientes => {
      todosClientes = clientes
      criarListaDeClientes(todosClientes);
    })
    .catch(error => {
      console.error('Erro ao carregar clientes:', error);
    });
};

function initialize() {
  getAllClientes()
    .then(clientes => {
      todosClientes = clientes
      criarListaDeClientes(todosClientes);
      addEventListeners();

    })
    .catch(error => {
      console.error('Erro ao carregar clientes:', error);
    });

  criarMenu('Clientes');
}

function addEventListeners() {
  newEmployeeButton.addEventListener("click", renderModal);
  salvarCliente.addEventListener('click', createClient);
  inputPhone.addEventListener('input', async (e) => {
    let phoneFormatado = phoneMask(inputPhone.value);
    inputPhone.value = phoneFormatado;
  });
  inputCpf.addEventListener('input', async (e) => {
    let cpfFormatado = cpfMask(inputCpf.value);
    inputCpf.value = cpfFormatado;
  });
}

window.addEventListener('DOMContentLoaded', initialize);
