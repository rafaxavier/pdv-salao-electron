// CRUD Requisicoes IPC
const getAllColaboradores = () => {
  return new Promise((resolve, reject) => {
    window.electron.ipcRenderer.sendMessage('obterColaboradores');
    window.electron.ipcRenderer.once('obterColaboradoresResult', (resposta) => {
      resolve(resposta.colaboradores);
    });
  });
};

const createColaborador = (nome, profissao, cpf) => {
  return new Promise((resolve, reject) => {
    window.electron.ipcRenderer.sendMessage('criarColaboradores', { nome, profissao, cpf });
    window.electron.ipcRenderer.once('criarColaboradoresResult', (resposta) => {
      console.log(resposta);
      resolve(resposta);
    });
  });
};

const deleteColaborador = (id) => {
  return new Promise((resolve, reject) => {
    window.electron.ipcRenderer.sendMessage('deletarColaboradores', { id });
    window.electron.ipcRenderer.once('deletarColaboradoresResult', (resposta) => {
      console.log(resposta);
      resolve(resposta);
    });
  });
};

const updateColaborador = (id, nome, profissao, cpf) => {
  return new Promise((resolve, reject) => {
    window.electron.ipcRenderer.sendMessage('editarColaboradores', { id, nome, profissao, cpf });
    window.electron.ipcRenderer.once('editarColaboradoresResult', (resposta) => {
      console.log(resposta);
      resolve(resposta);
    });
  });
};

/***************************************************************************************** */
let todosColaboradores = [];
const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('input', function () {
  const searchText = this.value.toLowerCase();
  const arr = todosColaboradores.filter(e => e.nome.toLowerCase().includes(searchText))
  table.innerHTML = '';
  criarListaDeColaboradores(arr);
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

// ####### salvar colaborador
const closeModalButton = document.getElementById('close-modal-cria-colaborador');
closeModalButton.addEventListener('click', function() {
    document.getElementById('modal-cria-colaborador').style.display = 'none';
});

const openModalButton = document.getElementById('open-modal-cria-colaborador');
openModalButton.addEventListener('click', function() {
    document.getElementById('modal-cria-colaborador').style.display = 'block';
});

async function salvarColaborador() {
  const nome = document.getElementById('nome-colaborador');
  const profissao = document.getElementById('profissao');
  const cpf = document.getElementById('cpf-colaborador');

  if (nome.value !== '' && profissao.value !== '' && cpf.value.length == 14) {
    await createColaborador(nome.value, profissao.value, cpf.value);
    nome.value = '';
    profissao.value = '';
    cpf.value = '';
    document.getElementById('modal-cria-colaborador').style.display = 'none';
    atualizarTabelaColaboradores();
  }
}

// ####### atualiza colaborador
async function atualizaColaborador() {
  const id = document.getElementById('id-colaborador').value;
  const nome = document.getElementById('edit-nome').value;
  const profissao = document.getElementById('edit-profissao').value;
  const cpf = document.getElementById('edit-cpf').value;

  if (nome !== '' && profissao !== '') {
    await updateColaborador(id, nome, profissao, cpf);
    document.getElementById('modal-editar-colaborador').style.display = "none";
    atualizarTabelaColaboradores();
  }
}

// ####### deleta colaborador
async function deletaColaborador(id) {
  await deleteColaborador(id);
  atualizarTabelaColaboradores();
}

// modal edite colaborador
async function renderModalEditColaborador(id, nome, profissao, cpf) {
  const modalEditar = document.getElementById('modal-editar-colaborador');
  const span = document.getElementsByClassName("close")[0];
  modalEditar.style.display = "block";

  document.getElementById('id-colaborador').value = id;
  document.getElementById('edit-nome').value = nome;
  document.getElementById('edit-profissao').value = profissao;
  document.getElementById('edit-cpf').value = cpf;

  span.addEventListener('click', () => {
    modalEditar.style.display = "none";
  })
}


// Função para criar listagem de colaboradores (table)
const contentDiv = document.getElementById('content');
const table = document.createElement('table');

function criarListaDeColaboradores(colaboradores) {
  console.log(colaboradores)
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

  // Adiciona cada colaborador como uma linha na tabela
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

    editButton.addEventListener('click', () => renderModalEditColaborador(colaborador.id, colaborador.nome, colaborador.profissao, colaborador.cpf));

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
function atualizarTabelaColaboradores() {
  // Limpa o conteúdo da tabela
  searchInput.value = ''; // Limpa o conteúdo da tabela
  table.innerHTML = '';
  // Obtém a lista atualizada de colaboradores e recria a tabela
  getAllColaboradores()
    .then(colaboradores => {
      todosColaboradores = colaboradores
      criarListaDeColaboradores(todosColaboradores);
    })
    .catch(error => {
      console.error('Erro ao carregar colaboradores:', error);
    });
};


window.addEventListener('DOMContentLoaded', () => {

  getAllColaboradores().then(colaboradores => {
    todosColaboradores = colaboradores
    criarListaDeColaboradores(todosColaboradores);
  }).catch(error => {
    console.error('Erro ao carregar colaboradores:', error);
  });

  criarMenu('Colaboradores');

  // Atualiza a tabela
  table.innerHTML = ''; // Limpa o conteúdo da tabela

});

