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
let todosClientes = [];
const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('input', function () {
  const searchText = this.value.toLowerCase();
  const arr = todosClientes.filter(e => e.nome.toLowerCase().includes(searchText))
  table.innerHTML = '';
  criarListaDeClientes(arr);
});

// ####### mascaras para inputs
function handlePhone(event) {
  let input = event.target
  input.value = phoneMask(input.value)
}

function phoneMask(value) {
  if (!value) return ""
  value = value.replace(/\D/g, '')
  value = value.replace(/(\d{2})(\d)/, "($1) $2")
  value = value.replace(/(\d)(\d{4})$/, "$1-$2")
  return value
}

function handleCpf(event) {
  let input = event.target;
  input.value = cpfMask(input.value);
}

function cpfMask(value) {
  if (!value) return "";
  value = value.replace(/\D/g, '');
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  return value;
}

// ####### salvar cliente
const closeModalButton = document.getElementById('close-modal-cria-cliente');
closeModalButton.addEventListener('click', function() {
    document.getElementById('modal-criar-cliente').style.display = 'none';
});

const openModalButton = document.getElementById('open-modal-cria-cliente');
openModalButton.addEventListener('click', function() {
    document.getElementById('modal-criar-cliente').style.display = 'block';
});

async function salvarCliente() {
  const nome = document.getElementById('nome-cliente');
  const telefone = document.getElementById('telefone-cliente');
  const cpf = document.getElementById('cpf-cliente');

  if (nome.value !== '' && telefone.value !== '' && telefone.value.length >= 14 && cpf.value.length == 14) {
    await createCliente(nome.value, telefone.value, cpf.value);
    nome.value = '';
    telefone.value = '';
    cpf.value = '';
    document.getElementById('modal-criar-cliente').style.display = 'none';
    atualizarTabelaClientes();
  }
}

// ####### atualiza cliente
async function atualizaCliente() {
  const id = document.getElementById('id-cliente').value;
  const nome = document.getElementById('edit-nome').value;
  const telefone = document.getElementById('edit-telefone').value;
  const cpf = document.getElementById('edit-cpf').value;

  if (nome !== '' && telefone !== '' && telefone.length >= 14 && cpf.length == 14) {
    await updateCliente(id, nome, telefone, cpf);
    document.getElementById('modal-editar-cliente').style.display = "none";
    atualizarTabelaClientes();
  }
}

// ####### deleta cliente
async function deletaCliente(id) {
  await deleteCliente(id);
  atualizarTabelaClientes();
}

// modal edite cliente
async function renderModalEditCliente(id, nome, telefone, cpf) {
  const modalEditar = document.getElementById('modal-editar-cliente');
  const span = document.getElementsByClassName("close")[0];
  modalEditar.style.display = "block";

  document.getElementById('id-cliente').value = id;
  document.getElementById('edit-nome').value = nome;
  document.getElementById('edit-telefone').value = telefone;
  document.getElementById('edit-cpf').value = cpf;

  span.addEventListener('click', () => {
    modalEditar.style.display = "none";
  })
}


// Função para criar listagem de clientes (table)
const contentDiv = document.getElementById('content');
const table = document.createElement('table');

function criarListaDeClientes(clientes) {
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

  // Adiciona cada cliente como uma linha na tabela
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

    editButton.addEventListener('click', () => renderModalEditCliente(cliente.id, cliente.nome, cliente.telefone, cliente.cpf));

    column4.appendChild(editButton);
    column4.appendChild(deleteButton);

    row.appendChild(column0);
    row.appendChild(column1);
    row.appendChild(column2);
    row.appendChild(column3);
    row.appendChild(column4);

    // Adiciona a linha à tabela
    table.appendChild(row);
  });

  // Adiciona a tabela ao conteúdo da página
  contentDiv.innerHTML = ''; // Limpa o conteúdo da div
  contentDiv.appendChild(table);
};

/**-------------------------------------------------------------------------------------- */
function atualizarTabelaClientes() {
  // Limpa o conteúdo da tabela
  searchInput.value = ''; // Limpa o conteúdo da tabela
  table.innerHTML = '';
  // Obtém a lista atualizada de clientes e recria a tabela
  getAllClientes()
    .then(clientes => {
      todosClientes = clientes
      criarListaDeClientes(todosClientes);
    })
    .catch(error => {
      console.error('Erro ao carregar clientes:', error);
    });
};


window.addEventListener('DOMContentLoaded', () => {

  getAllClientes().then(clientes => {
    todosClientes = clientes
    criarListaDeClientes(todosClientes);
  }).catch(error => {
    console.error('Erro ao carregar clientes:', error);
  });

  criarMenu('Clientes');

  // Atualiza a tabela
  table.innerHTML = ''; // Limpa o conteúdo da tabela

});

