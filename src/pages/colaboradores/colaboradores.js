import { myToast } from '../../components/toast.js';
import { cpfMask } from '../../utils/masks.js';

// CRUD Requisicoes IPC
function getAllColaboradores() {
  return new Promise((resolve, reject) => {
    window.electron.ipcRenderer.sendMessage('obterColaboradores');
    window.electron.ipcRenderer.once('obterColaboradoresResult', (resposta) => {
      resolve(resposta.colaboradores);
    });
  });
};

function createColaborador(nome, profissao, cpf) {
  return new Promise((resolve, reject) => {
    window.electron.ipcRenderer.sendMessage('criarColaboradores', { nome, profissao, cpf });
    window.electron.ipcRenderer.once('criarColaboradoresResult', (resposta) => {
      if (resposta.success) {
        console.log(resposta);
        resolve(resposta);
      } else {
        const erro = new Error(resposta.msg);
        reject(erro);
      }
    });
  });
};

function deleteColaborador(id) {
  return new Promise((resolve, reject) => {
    window.electron.ipcRenderer.sendMessage('deletarColaboradores', { id });
    window.electron.ipcRenderer.once('deletarColaboradoresResult', (resposta) => {
      console.log(resposta);
      resolve(resposta);
    });
  });
};

function updateColaborador(id, nome, profissao, cpf) {
  return new Promise((resolve, reject) => {
    window.electron.ipcRenderer.sendMessage('editarColaboradores', { id, nome, profissao, cpf });
    window.electron.ipcRenderer.once('editarColaboradoresResult', (resposta) => {
      console.log(resposta);
      resolve(resposta);
    });
  });
};

/***************************************************************************************** */
// ####### cria colaborador
async function createEmployee() {
  if (inputNome.value !== '' && inputProfissao.value !== '' && inputCpf.value.length == 14) {
    await createColaborador(inputNome.value, inputProfissao.value, inputCpf.value)
      .then((res) => {
        clearInputFields();
        modalColaborador.style.display = 'none';
        myToast(res.msg, 'success');
        refreshTableEmployees();
      })
      .catch((err) => {
        modalColaborador.style.display = 'none';
        myToast(err, 'error');
        refreshTableEmployees();
      });
  }
}

// ####### editar colaborador
async function updateEmployee() {
  if (inputNome.value !== '' && inputProfissao.value !== '') {
    await updateColaborador(inputID.value, inputNome.value, inputProfissao.value, inputCpf.value)
      .then((res) => {
        clearInputFields();
        document.getElementById('modal-cria-colaborador').style.display = "none";
        myToast(res.msg, 'success');
        refreshTableEmployees();
      })
      .catch((err) => {
        modalColaborador.style.display = 'none';
        myToast('err', 'error');
        refreshTableEmployees();
      });
  }
}

// ####### deleta colaborador
async function deletaColaborador(id) {
  await deleteColaborador(id);
  myToast('deletado com sucesso!', 'success');
  refreshTableEmployees();
}

let todosColaboradores = [];

const searchInput = document.getElementById('searchInput');
const newEmployeeButton = document.getElementById("open-modal-cria-colaborador");
const inputID = document.getElementById('id-colaborador');
const inputNome = document.getElementById('nome-colaborador');
const inputProfissao = document.getElementById('profissao');
const inputCpf = document.getElementById('cpf-colaborador');
const modalColaborador = document.getElementById('modal-cria-colaborador');
const titleModal = document.getElementById('title-modal');
const salvarColaborador = document.getElementById('btn-salvar-colaborador');
const contentDiv = document.getElementById('content');
const table = document.createElement('table');

let debounceTimeout;
searchInput.addEventListener('input', function () {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    const searchText = this.value.toLowerCase();
    const arr = todosColaboradores.filter(e => e.nome.toLowerCase().includes(searchText));
    table.innerHTML = '';
    criarListaDeColaboradores(arr);
  }, 300);
});

function renderModal(colaborador = '') {
  modalColaborador.style.display = "block";
  const span = document.getElementsByClassName("close")[0];
  const { id, nome, profissao, cpf } = colaborador;

  if (id) {
    titleModal.textContent = 'Editar Colaborador';
    inputID.value = id;
    inputNome.value = nome;
    inputProfissao.value = profissao;
    inputCpf.value = cpf;
    salvarColaborador.removeEventListener('click', createEmployee);
    salvarColaborador.addEventListener('click', updateEmployee);
  } else {
    salvarColaborador.removeEventListener('click', updateEmployee);
    salvarColaborador.addEventListener('click', createEmployee);
    titleModal.textContent = 'Criar Colaborador';
    clearInputFields();
  }


  span.addEventListener('click', () => {
    clearInputFields();
    modalColaborador.style.display = "none";
  });
}

function clearInputFields() {
  inputID.value = '';
  inputNome.value = '';
  inputProfissao.value = '';
  inputCpf.value = '';
}

async function criarListaDeColaboradores(colaboradores) {
  table.innerHTML = '';

  const headerRow = document.createElement('tr');
  const th0 = document.createElement('th');
  const th1 = document.createElement('th');
  const th2 = document.createElement('th');
  const th3 = document.createElement('th');
  const th4 = document.createElement('th');

  th0.textContent = 'ID';
  th1.textContent = 'Nome';
  th2.textContent = 'Profissão';
  th3.textContent = 'Cpf';
  th4.textContent = 'Ação';
  headerRow.appendChild(th0);
  headerRow.appendChild(th1);
  headerRow.appendChild(th2);
  headerRow.appendChild(th3);
  headerRow.appendChild(th4);
  table.appendChild(headerRow);

  colaboradores.forEach(colaborador => {
    const row = document.createElement('tr');
    const column0 = document.createElement('td');
    const column1 = document.createElement('td');
    const column2 = document.createElement('td');
    const column3 = document.createElement('td');
    const column4 = document.createElement('td');
    const deleteButton = document.createElement('button');
    const editButton = document.createElement('button');

    column0.textContent = colaborador.id;
    column1.textContent = colaborador.nome;
    column2.textContent = colaborador.profissao;
    column3.textContent = colaborador.cpf;

    editButton.textContent = 'Editar';
    editButton.classList.add('btn-warning', 'btn-sm');
    deleteButton.textContent = 'Deletar';
    deleteButton.classList.add('btn-danger', 'btn-sm')

    deleteButton.addEventListener('click', () => deletaColaborador(colaborador.id));
    editButton.addEventListener('click', () => renderModal(colaborador));

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

  getAllColaboradores()
    .then(colaboradores => {
      todosColaboradores = colaboradores
      criarListaDeColaboradores(todosColaboradores);
    })
    .catch(error => {
      console.error('Erro ao carregar colaboradores:', error);
    });
};

function initialize() {
  getAllColaboradores()
    .then(colaboradores => {
      todosColaboradores = colaboradores
      criarListaDeColaboradores(todosColaboradores);
      addEventListeners();

    })
    .catch(error => {
      console.error('Erro ao carregar colaboradores:', error);
    });

  criarMenu('Colaboradores');
}

function addEventListeners() {
  newEmployeeButton.addEventListener("click", renderModal);
  salvarColaborador.addEventListener('click', createEmployee);
  inputCpf.addEventListener('input', async (e) => {
    let cpfFormatado = cpfMask(inputCpf.value);
    inputCpf.value = cpfFormatado;
  });
}

window.addEventListener('DOMContentLoaded', initialize);
