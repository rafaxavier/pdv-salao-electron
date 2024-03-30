// CRUD Requisicoes IPC
const getAllClientes = () => {
  return new Promise((resolve, reject) => {
    window.electron.ipcRenderer.sendMessage('obterClientes');
    // Adicione um listener para receber os clientes
    window.electron.ipcRenderer.once('obterClientesResult', (resposta) => {
      console.log(resposta.clientes);
      resolve(resposta.clientes);
    });
  });
};

const createCliente = (nome, telefone) => {
  return new Promise((resolve, reject) => {
    window.electron.ipcRenderer.sendMessage('criarClientes', { nome, telefone });
    // Adicione um listener para receber os clientes
    window.electron.ipcRenderer.once('criarClientesResult', (resposta) => {
      console.log(resposta);
      resolve(resposta);
    });
  });
};

const deleteCliente = (id) => {
  return new Promise((resolve, reject) => {
    window.electron.ipcRenderer.sendMessage('deletarClientes', { id });
    // Adicione um listener para receber os clientes
    window.electron.ipcRenderer.once('deletarClientesResult', (resposta) => {
      console.log(resposta);
      resolve(resposta);
    });
  });
};

const updateCliente = (id, nome, telefone) => {
  return new Promise((resolve, reject) => {
    window.electron.ipcRenderer.sendMessage('editarClientes', { id, nome, telefone });
    // Adicione um listener para receber os clientes
    window.electron.ipcRenderer.once('editarClientesResult', (resposta) => {
      console.log(resposta);
      resolve(resposta);
    });
  });
};

/***************************************************************************************** */
// salvar cliente
async function salvarCliente() {
  const nome = document.getElementById('nome-cliente');
  const telefone = document.getElementById('telefone-cliente');

  if (nome.value !== '' && telefone.value !== '') {
    await createCliente(nome.value, telefone.value);
    nome.value = '';
    telefone.value = '';
    atualizarTabelaClientes();
  }
}

// atualiza cliente
async function atualizaCliente() {
  const id = document.getElementById('id-cliente').value;
  const nome = document.getElementById('edit-nome').value;
  const telefone = document.getElementById('edit-telefone').value;

  if (nome !== '' && telefone !== '') {
    await updateCliente(id, nome, telefone);
    document.getElementById('modal-editar-cliente').style.display = "none";
    atualizarTabelaClientes();
  }
}

// deleta cliente
async function deletaCliente(id) {
  await deleteCliente(id);
  atualizarTabelaClientes();
}

// modal edite cliente
async function renderModalEditCliente(id, nome, telefone) {
  const modalEditar = document.getElementById('modal-editar-cliente');
  const span = document.getElementsByClassName("close")[0];
  modalEditar.style.display = "block";

  document.getElementById('id-cliente').value = id;
  document.getElementById('edit-nome').value = nome;
  document.getElementById('edit-telefone').value = telefone;

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

  th0.textContent = 'ID';
  th1.textContent = 'Nome';
  th2.textContent = 'Telefone';
  th3.textContent = 'Ação';
  headerRow.appendChild(th0);
  headerRow.appendChild(th1);
  headerRow.appendChild(th2);
  headerRow.appendChild(th3);
  table.appendChild(headerRow);

  // Adiciona cada cliente como uma linha na tabela
  clientes.forEach(cliente => {
    const row = document.createElement('tr');
    const column0 = document.createElement('td');
    const column1 = document.createElement('td');
    const column2 = document.createElement('td');
    const column3 = document.createElement('td');
    const deleteButton = document.createElement('button');
    const editButton = document.createElement('button');

    column0.textContent = cliente.id;
    column1.textContent = cliente.nome;
    column2.textContent = cliente.telefone;

    editButton.textContent = 'Editar';
    deleteButton.textContent = 'Deletar';

    deleteButton.addEventListener('click', () => deletaCliente(cliente.id));

    editButton.addEventListener('click', () => renderModalEditCliente(cliente.id, cliente.nome, cliente.telefone));

    column3.appendChild(editButton);
    column3.appendChild(deleteButton);

    row.appendChild(column0);
    row.appendChild(column1);
    row.appendChild(column2);
    row.appendChild(column3);

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
  table.innerHTML = ''; // Limpa o conteúdo da tabela

  // Obtém a lista atualizada de clientes e recria a tabela
  getAllClientes()
    .then(clientes => {
      criarListaDeClientes(clientes);
    })
    .catch(error => {
      console.error('Erro ao carregar clientes:', error);
    });
};


window.addEventListener('DOMContentLoaded', () => {

  getAllClientes().then(clientes => {
    criarListaDeClientes(clientes);
  }).catch(error => {
    console.error('Erro ao carregar clientes:', error);
  });

  criarMenu('Clientes');

  // Atualiza a tabela
  table.innerHTML = ''; // Limpa o conteúdo da tabela

});

