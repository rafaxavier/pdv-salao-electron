// CRUD Requisicoes IPC
export function getAllServicos() {
  return new Promise((resolve, reject) => {
    window.electron.ipcRenderer.sendMessage('obterServicos');
    window.electron.ipcRenderer.once('obterServicosResult', (resposta) => {
      resolve(resposta.servicos);
    });
  });
};

export function createServico(nome, preco, taxa) {
  return new Promise((resolve, reject) => {
    window.electron.ipcRenderer.sendMessage('criarServicos', { nome, preco, taxa });
    window.electron.ipcRenderer.once('criarServicosResult', (resposta) => {
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

export function deleteServico(id) {
  return new Promise((resolve, reject) => {
    window.electron.ipcRenderer.sendMessage('deletarServicos', { id });
    window.electron.ipcRenderer.once('deletarServicosResult', (resposta) => {
      console.log(resposta);
      resolve(resposta);
    });
  });
};

export function updateServico(id, nome, preco, taxa) {
  return new Promise((resolve, reject) => {
    window.electron.ipcRenderer.sendMessage('editarServicos', { id, nome, preco, taxa });
    window.electron.ipcRenderer.once('editarServicosResult', (resposta) => {
      console.log(resposta);
      resolve(resposta);
    });
  });
};
