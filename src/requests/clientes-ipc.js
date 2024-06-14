// CRUD Requisicoes IPC
export const getAllClientes = () => {
  return new Promise((resolve, reject) => {
    window.electron.ipcRenderer.sendMessage('obterClientes');
    window.electron.ipcRenderer.once('obterClientesResult', (resposta) => {
      resolve(resposta.clientes);
    });
  });
};

export const createCliente = (nome, telefone, cpf) => {
  return new Promise((resolve, reject) => {
    window.electron.ipcRenderer.sendMessage('criarClientes', { nome, telefone, cpf });
    window.electron.ipcRenderer.once('criarClientesResult', (resposta) => {
      console.log(resposta);
      resolve(resposta);
    });
  });
};

export const deleteCliente = (id) => {
  return new Promise((resolve, reject) => {
    window.electron.ipcRenderer.sendMessage('deletarClientes', { id });
    window.electron.ipcRenderer.once('deletarClientesResult', (resposta) => {
      console.log(resposta);
      resolve(resposta);
    });
  });
};

export const updateCliente = (id, nome, telefone, cpf) => {
  return new Promise((resolve, reject) => {
    window.electron.ipcRenderer.sendMessage('editarClientes', { id, nome, telefone, cpf });
    window.electron.ipcRenderer.once('editarClientesResult', (resposta) => {
      console.log(resposta);
      resolve(resposta);
    });
  });
};
